/**
 * AUTO-GENERATED FILE. DO NOT EDIT.
 * generator-version: 1
 * wordpress-version: unknown
 * woocommerce-version: 9.9.7
 * woocommerce-version-source: cli
 */

import { z } from "zod";

/**
 * POST /settings/{group_id}/batch path parameters.
 */
export const settingBatchUpdatePathParamsSchema = z
  .object({ group_id: z.string() })
  .strict();

export type SettingBatchUpdatePathParams = z.infer<
  typeof settingBatchUpdatePathParamsSchema
>;

/**
 * POST /settings/{group_id}/batch request body.
 */
export const settingBatchUpdateBodySchema = z
  .object({
    create: z
      .array(
        z
          .object({
            group: z.string().optional().describe("Settings group ID."),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Setting value."),
          })
          .strict(),
      )
      .optional(),
    delete: z.array(z.number()).optional(),
    update: z
      .array(
        z
          .object({
            group: z.string().optional().describe("Settings group ID."),
            id: z.number(),
            value: z
              .union([
                z.record(z.string(), z.unknown()),
                z.string(),
                z.number(),
                z.boolean(),
                z.number(),
                z.array(z.unknown()),
              ])
              .nullable()
              .optional()
              .describe("Setting value."),
          })
          .strict(),
      )
      .optional(),
  })
  .strict();

export type SettingBatchUpdateBody = z.infer<
  typeof settingBatchUpdateBodySchema
>;

/**
 * POST /settings/{group_id}/batch response body.
 */
export const settingBatchUpdateResponseSchema = z.unknown();

export type SettingBatchUpdateResponse = z.infer<
  typeof settingBatchUpdateResponseSchema
>;

/**
 * GET /settings/{group_id} path parameters.
 */
export const settingGetGroupIdPathParamsSchema = z
  .object({ group_id: z.string() })
  .strict();

export type SettingGetGroupIdPathParams = z.infer<
  typeof settingGetGroupIdPathParamsSchema
>;

/**
 * GET /settings/{group_id} query parameters.
 */
export const settingGetGroupIdQuerySchema = z
  .object({ group: z.string().optional().describe("Settings group ID.") })
  .strict();

export type SettingGetGroupIdQuery = z.infer<
  typeof settingGetGroupIdQuerySchema
>;

/**
 * GET /settings/{group_id} response body.
 */
export const settingGetGroupIdResponseSchema = z
  .object({
    description: z
      .string()
      .optional()
      .describe(
        "A human readable description for the setting used in interfaces.",
      ),
    id: z
      .string()
      .optional()
      .describe(
        "A unique identifier that can be used to link settings together.",
      ),
    label: z
      .string()
      .optional()
      .describe("A human readable label for the setting used in interfaces."),
    parent_id: z.string().optional().describe("ID of parent grouping."),
    sub_groups: z.string().optional().describe("IDs for settings sub groups."),
  })
  .strict();

export type SettingGetGroupIdResponse = z.infer<
  typeof settingGetGroupIdResponseSchema
>;

/**
 * GET /settings/{group_id}/{id} path parameters.
 */
export const settingGetGroupIdIdPathParamsSchema = z
  .object({ group_id: z.string(), id: z.string() })
  .strict();

export type SettingGetGroupIdIdPathParams = z.infer<
  typeof settingGetGroupIdIdPathParamsSchema
>;

/**
 * GET /settings/{group_id}/{id} query parameters.
 */
export const settingGetGroupIdIdQuerySchema = z
  .object({ group: z.string().optional().describe("Settings group ID.") })
  .strict();

export type SettingGetGroupIdIdQuery = z.infer<
  typeof settingGetGroupIdIdQuerySchema
>;

/**
 * GET /settings/{group_id}/{id} response body.
 */
export const settingGetGroupIdIdResponseSchema = z.unknown();

export type SettingGetGroupIdIdResponse = z.infer<
  typeof settingGetGroupIdIdResponseSchema
>;

/**
 * POST /settings/{group_id}/{id} path parameters.
 */
export const settingPostCustomPathParamsSchema = z
  .object({ group_id: z.string(), id: z.string() })
  .strict();

export type SettingPostCustomPathParams = z.infer<
  typeof settingPostCustomPathParamsSchema
>;

/**
 * POST /settings/{group_id}/{id} request body.
 */
export const settingPostCustomBodySchema = z
  .object({
    group: z.string().optional().describe("Settings group ID."),
    value: z
      .union([
        z.record(z.string(), z.unknown()),
        z.string(),
        z.number(),
        z.boolean(),
        z.number(),
        z.array(z.unknown()),
      ])
      .nullable()
      .optional()
      .describe("Setting value."),
  })
  .strict();

export type SettingPostCustomBody = z.infer<typeof settingPostCustomBodySchema>;

/**
 * POST /settings/{group_id}/{id} response body.
 */
export const settingPostCustomResponseSchema = z.unknown();

export type SettingPostCustomResponse = z.infer<
  typeof settingPostCustomResponseSchema
>;

/**
 * PUT /settings/batch response body.
 */
export const settingPutBatchCustomBatchResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type SettingPutBatchCustomBatchResponse = z.infer<
  typeof settingPutBatchCustomBatchResponseSchema
>;

/**
 * PUT /settings/{group_id}/batch path parameters.
 */
export const settingPutBatchCustomGroupIdBatchPathParamsSchema = z
  .object({ group_id: z.string() })
  .strict();

export type SettingPutBatchCustomGroupIdBatchPathParams = z.infer<
  typeof settingPutBatchCustomGroupIdBatchPathParamsSchema
>;

/**
 * PUT /settings/{group_id}/batch request body.
 */
export const settingPutBatchCustomGroupIdBatchBodySchema = z
  .object({
    group: z.string().optional().describe("Settings group ID."),
    value: z
      .union([
        z.record(z.string(), z.unknown()),
        z.string(),
        z.number(),
        z.boolean(),
        z.number(),
        z.array(z.unknown()),
      ])
      .nullable()
      .optional()
      .describe("Setting value."),
  })
  .strict();

export type SettingPutBatchCustomGroupIdBatchBody = z.infer<
  typeof settingPutBatchCustomGroupIdBatchBodySchema
>;

/**
 * PUT /settings/{group_id}/batch response body.
 */
export const settingPutBatchCustomGroupIdBatchResponseSchema = z.unknown();

export type SettingPutBatchCustomGroupIdBatchResponse = z.infer<
  typeof settingPutBatchCustomGroupIdBatchResponseSchema
>;

/**
 * PUT /settings/{group_id}/{id} path parameters.
 */
export const settingUpdatePathParamsSchema = z
  .object({ group_id: z.string(), id: z.string() })
  .strict();

export type SettingUpdatePathParams = z.infer<
  typeof settingUpdatePathParamsSchema
>;

/**
 * PUT /settings/{group_id}/{id} request body.
 */
export const settingUpdateBodySchema = z
  .object({
    group: z.string().optional().describe("Settings group ID."),
    value: z
      .union([
        z.record(z.string(), z.unknown()),
        z.string(),
        z.number(),
        z.boolean(),
        z.number(),
        z.array(z.unknown()),
      ])
      .nullable()
      .optional()
      .describe("Setting value."),
  })
  .strict();

export type SettingUpdateBody = z.infer<typeof settingUpdateBodySchema>;

/**
 * PUT /settings/{group_id}/{id} response body.
 */
export const settingUpdateResponseSchema = z.unknown();

export type SettingUpdateResponse = z.infer<typeof settingUpdateResponseSchema>;

/**
 * POST /settings/batch request body.
 */
export const settingsBatchUpdateBodySchema = z
  .object({
    create: z.array(z.record(z.string(), z.unknown())).optional(),
    delete: z.array(z.number()).optional(),
    update: z.array(z.object({ id: z.number() }).strict()).optional(),
  })
  .strict();

export type SettingsBatchUpdateBody = z.infer<
  typeof settingsBatchUpdateBodySchema
>;

/**
 * POST /settings/batch response body.
 */
export const settingsBatchUpdateResponseSchema = z
  .object({
    create: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of created resources."),
    delete: z
      .array(z.number())
      .optional()
      .describe("List of delete resources."),
    update: z
      .array(z.record(z.string(), z.unknown()))
      .optional()
      .describe("List of updated resources."),
  })
  .strict();

export type SettingsBatchUpdateResponse = z.infer<
  typeof settingsBatchUpdateResponseSchema
>;

/**
 * GET /settings response body.
 */
export const settingsListResponseSchema = z.array(
  z
    .object({
      description: z
        .string()
        .optional()
        .describe(
          "A human readable description for the setting used in interfaces.",
        ),
      id: z
        .string()
        .optional()
        .describe(
          "A unique identifier that can be used to link settings together.",
        ),
      label: z
        .string()
        .optional()
        .describe("A human readable label for the setting used in interfaces."),
      parent_id: z.string().optional().describe("ID of parent grouping."),
      sub_groups: z
        .string()
        .optional()
        .describe("IDs for settings sub groups."),
    })
    .strict(),
);

export type SettingsListResponse = z.infer<typeof settingsListResponseSchema>;
