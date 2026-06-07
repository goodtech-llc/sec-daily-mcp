import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { SecDailyAPI } from "sec-daily-api";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

// ---------------------------------------------------------------------------
// Input schemas
// ---------------------------------------------------------------------------

const SearchFilingsSchema = z.object({
  ticker: z.string().optional().describe(
    'Filter by company ticker symbol, e.g. "AAPL", "MSFT", "TSLA".',
  ),
  cik: z.string().optional().describe(
    "Filter by company CIK (numeric string). Use instead of ticker when you have the CIK.",
  ),
  accessionNumber: z.string().optional().describe(
    'Fetch a single filing by its SEC accession number, e.g. "0001193125-24-012345".',
  ),
  formTypes: z.union([z.string(), z.array(z.string())]).optional().describe(
    'Filter by SEC form type(s), e.g. "10-K", "10-Q", "8-K", "4", "S-1", "13F-HR". Separate multiple with commas or pass as array.',
  ),
  filingDate: z.string().optional().describe(
    "Fetch filings for an exact date (YYYY-MM-DD).",
  ),
  filingDateStart: z.string().optional().describe(
    "Filing date range start (YYYY-MM-DD).",
  ),
  filingDateEnd: z.string().optional().describe(
    "Filing date range end (YYYY-MM-DD).",
  ),
  fieldset: z.enum(["minimal", "standard", "full"]).optional().describe(
    '"minimal": ID, CIK, form type, dates, links. "standard": all of minimal + entity info, document links, AI summary. "full": all of standard + markdown content of the filing. Default: all stored fields.',
  ),
  limit: z.number().int().min(1).max(1000).optional().describe(
    "Results per page (default 200, max 1000).",
  ),
  cursor: z.string().optional().describe(
    "Opaque pagination cursor. Pass the nextCursor from a previous response to fetch the next page.",
  ),
});

const GetEntitySchema = z.object({
  ticker: z.string().optional().describe(
    'Look up a company by ticker symbol, e.g. "AAPL". Use this when you have a ticker.',
  ),
  cik: z.string().optional().describe(
    "Look up a company by CIK (numeric string). Use this when you have the CIK.",
  ),
});

const GetFilingSchema = z.object({
  id: z.string().optional().describe(
    "Fetch a filing by its internal ID (SHA-256 of the accession number).",
  ),
  accessionNumber: z.string().optional().describe(
    'Fetch a filing by its SEC accession number, e.g. "0001193125-24-012345".',
  ),
});

const GetNewsSchema = z.object({
  newsType: z.string().optional().describe(
    'Type of news to retrieve. Default: "PressReleases".',
  ),
  startDate: z.string().optional().describe(
    "News start date (YYYY-MM-DD).",
  ),
  endDate: z.string().optional().describe(
    "News end date (YYYY-MM-DD).",
  ),
  limit: z.number().int().min(1).max(100).optional().describe(
    "Number of results (default 40, max 100).",
  ),
});

// ---------------------------------------------------------------------------
// Server
// ---------------------------------------------------------------------------

const server = new Server(
  { name: "sec-daily-mcp", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

let client: SecDailyAPI | null = null;

function getClient(): SecDailyAPI {
  if (!client) {
    client = new SecDailyAPI();
  }
  return client;
}

const ZOD_OPTIONS = { $refStrategy: "none" } as const;

// ---------------------------------------------------------------------------
// Tool list
// ---------------------------------------------------------------------------

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "search_filings",
      description:
        "Search and filter SEC EDGAR filings. Use this to find 10-K, 10-Q, 8-K, S-1, Form 4, 13F, and any other SEC form type " +
        "for a specific company (by ticker or CIK) or across all companies by date range. " +
        "Each result includes company info, filing dates, form type, links to the original SEC documents, and an AI-generated summary. " +
        "When pagination.hasMore is true, call again with the nextCursor to get the next page.",
      inputSchema: zodToJsonSchema(SearchFilingsSchema, ZOD_OPTIONS),
    },
    {
      name: "get_entity",
      description:
        "Look up a company's SEC profile by ticker symbol or CIK. " +
        "Returns company name, CIK, ticker, exchange, SIC code and industry description, state of incorporation, fiscal year end, " +
        "business address, website, and former names. Use this to resolve a ticker to a CIK or to get company background information.",
      inputSchema: zodToJsonSchema(GetEntitySchema, ZOD_OPTIONS),
    },
    {
      name: "get_filing",
      description:
        "Fetch a single SEC filing by its internal ID or SEC accession number. " +
        "Returns the full filing record including all document links and AI summary. " +
        "Use this when you already have a specific filing ID or accession number from a previous search.",
      inputSchema: zodToJsonSchema(GetFilingSchema, ZOD_OPTIONS),
    },
    {
      name: "get_news",
      description:
        "Retrieve SEC press releases and market news. " +
        "Use this to find recent official announcements and regulatory news from the SEC. " +
        "Supports date range filtering and news type selection.",
      inputSchema: zodToJsonSchema(GetNewsSchema, ZOD_OPTIONS),
    },
  ],
}));

// ---------------------------------------------------------------------------
// Tool handler
// ---------------------------------------------------------------------------

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  const c = getClient();

  switch (name) {
    case "search_filings": {
      const params = SearchFilingsSchema.parse(args ?? {});
      const result = await c.getFilings(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }

    case "get_entity": {
      const params = GetEntitySchema.parse(args ?? {});
      if (!params.ticker && !params.cik) {
        throw new Error("get_entity requires either 'ticker' or 'cik'");
      }
      const result = await c.getEntity(params as { ticker: string } | { cik: string });
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }

    case "get_filing": {
      const params = GetFilingSchema.parse(args ?? {});
      if (!params.id && !params.accessionNumber) {
        throw new Error("get_filing requires either 'id' or 'accessionNumber'");
      }
      const result = params.id
        ? await c.getFiling(params.id)
        : await c.getFilingByAccession(params.accessionNumber!);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }

    case "get_news": {
      const params = GetNewsSchema.parse(args ?? {});
      const result = await c.getNews(params);
      return { content: [{ type: "text", text: JSON.stringify(result, null, 2) }] };
    }

    default:
      throw new Error(`Unknown tool: ${name}`);
  }
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------

const transport = new StdioServerTransport();
await server.connect(transport);
