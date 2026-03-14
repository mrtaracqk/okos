import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import {
  generatedWooCommerceToolRegistry,
  generatedWooCommerceWorkerToolsets,
  type GeneratedWooCommerceToolName,
  type GeneratedWooCommerceWorkerName,
} from '../../../generated/woocommerceTools.generated';
import { getWooCommerceTransportService } from '../../../services/woocommerceTransport';

type JsonSchemaObject = {
  type?: string | string[];
  description?: string;
  enum?: ReadonlyArray<string | number | boolean | null>;
  properties?: Record<string, JsonSchemaObject>;
  required?: ReadonlyArray<string>;
  items?: JsonSchemaObject | ReadonlyArray<JsonSchemaObject>;
  additionalProperties?: boolean | JsonSchemaObject;
  anyOf?: ReadonlyArray<JsonSchemaObject>;
  oneOf?: ReadonlyArray<JsonSchemaObject>;
};

type GeneratedTransportTool = ReturnType<typeof tool> & {
  actualToolName: GeneratedWooCommerceToolName;
};

function buildModelSafeToolNameMap() {
  const toolNames = Object.keys(generatedWooCommerceToolRegistry) as GeneratedWooCommerceToolName[];
  const actualToSafe = new Map<GeneratedWooCommerceToolName, string>();
  const safeToActual = new Map<string, GeneratedWooCommerceToolName>();

  for (const toolName of toolNames) {
    const safeToolName = toolName.replace(/\./g, '_');
    const duplicate = safeToActual.get(safeToolName);
    if (duplicate && duplicate !== toolName) {
      throw new Error(`Generated WooCommerce tool alias collision: "${toolName}" and "${duplicate}" -> "${safeToolName}"`);
    }

    actualToSafe.set(toolName, safeToolName);
    safeToActual.set(safeToolName, toolName);
  }

  return actualToSafe;
}

const generatedToolNameAliases = buildModelSafeToolNameMap();

function applyDescription(schema: z.ZodTypeAny, description?: string) {
  return description ? schema.describe(description) : schema;
}

function buildObjectSchema(schema: JsonSchemaObject) {
  const properties = schema.properties ?? {};
  const required = new Set(schema.required ?? []);
  const shape = Object.fromEntries(
    Object.entries(properties).map(([key, value]) => {
      const propertySchema = buildZodSchema(value);
      return [key, required.has(key) ? propertySchema : propertySchema.optional()];
    })
  );

  const objectSchema = schema.additionalProperties !== false ? z.object(shape).passthrough() : z.object(shape);
  return applyDescription(objectSchema, schema.description);
}

function buildUnionSchema(schemaOptions: ReadonlyArray<JsonSchemaObject>) {
  if (schemaOptions.length === 0) {
    return z.any();
  }

  if (schemaOptions.length === 1) {
    return buildZodSchema(schemaOptions[0]);
  }

  const [first, second, ...rest] = schemaOptions.map((option) => buildZodSchema(option));
  let unionSchema = z.union([first, second]);

  for (const schemaOption of rest) {
    unionSchema = z.union([unionSchema, schemaOption]);
  }

  return unionSchema;
}

function buildEnumSchema(values: ReadonlyArray<string | number | boolean | null>, description?: string) {
  const literals = values.map((value) => z.literal(value));

  if (literals.length === 0) {
    return z.any();
  }

  const schema = literals.length === 1 ? literals[0] : z.union([literals[0], literals[1], ...literals.slice(2)]);
  return applyDescription(schema, description);
}

function buildZodSchema(schema: JsonSchemaObject): z.ZodTypeAny {
  if (schema.anyOf && schema.anyOf.length > 0) {
    return applyDescription(buildUnionSchema(schema.anyOf), schema.description);
  }

  if (schema.oneOf && schema.oneOf.length > 0) {
    return applyDescription(buildUnionSchema(schema.oneOf), schema.description);
  }

  if (schema.enum && schema.enum.length > 0) {
    return buildEnumSchema(schema.enum, schema.description);
  }

  if (Array.isArray(schema.type)) {
    return applyDescription(
      buildUnionSchema(schema.type.map((type) => ({ ...schema, type, description: undefined }))),
      schema.description
    );
  }

  switch (schema.type) {
    case 'object':
      return buildObjectSchema(schema);
    case 'array': {
      const items = Array.isArray(schema.items) ? schema.items[0] : schema.items;
      return applyDescription(z.array(items ? buildZodSchema(items) : z.any()), schema.description);
    }
    case 'string':
      return applyDescription(z.string(), schema.description);
    case 'number':
      return applyDescription(z.number(), schema.description);
    case 'integer':
      return applyDescription(z.number().int(), schema.description);
    case 'boolean':
      return applyDescription(z.boolean(), schema.description);
    case 'null':
      return applyDescription(z.null(), schema.description);
    default:
      return applyDescription(z.any(), schema.description);
  }
}

function buildInputSchema(toolName: GeneratedWooCommerceToolName) {
  const spec = generatedWooCommerceToolRegistry[toolName];
  return buildZodSchema((spec.inputSchema ?? { type: 'object', additionalProperties: true }) as unknown as JsonSchemaObject);
}

function buildToolDescription(toolName: GeneratedWooCommerceToolName) {
  const spec = generatedWooCommerceToolRegistry[toolName];
  return spec.description || `Execute ${toolName}.`;
}

export function createGeneratedTransportTools(workerName: GeneratedWooCommerceWorkerName) {
  const transportService = getWooCommerceTransportService();

  return generatedWooCommerceWorkerToolsets[workerName].map((toolName) => {
    const generatedTool = tool(
      async (args: Record<string, unknown>) => {
        return transportService.callTool(toolName, args ?? {});
      },
      {
        // OpenAI tool calling rejects dots in function names, while MCP tool names use them.
        name: generatedToolNameAliases.get(toolName) ?? toolName,
        description: buildToolDescription(toolName),
        schema: buildInputSchema(toolName),
      }
    );

    return Object.assign(generatedTool, { actualToolName: toolName }) as GeneratedTransportTool;
  });
}
