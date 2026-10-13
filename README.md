# SEC Daily MCP Server

Official [Model Context Protocol (MCP)](https://modelcontextprotocol.io) server for the [SEC Daily API](https://www.secdailyapi.com) — gives AI assistants real-time access to SEC EDGAR filings, company data, and news.

Works with any MCP-compatible AI tool: **Claude Desktop**, **Cursor**, **Windsurf**, **VS Code Copilot**, **ChatGPT Desktop**, **Cline**, **Continue**, and more.

## Prerequisites

- Node.js 20 or later
- A SEC Daily API key — get one free at [secdailyapi.com](https://www.secdailyapi.com)

## Setup

### Claude Desktop

Edit `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows):

```json
{
  "mcpServers": {
    "sec-daily": {
      "command": "npx",
      "args": ["-y", "sec-daily-mcp"],
      "env": {
        "SEC_DAILY_API_KEY": "your-api-key-here"
      }
    }
  }
}
```

Restart Claude Desktop. The SEC Daily tools will be available automatically.

### Claude Code — one command

Claude Code can install this as a plugin, which adds the hosted server *and* a
skill that tells Claude how the data behaves (paging, filing date versus period
of report, and which limits come from your plan):

```shell
/plugin install sec-daily --marketplace goodtech-llc/insider-trades-mcp
```

On Claude Code older than 2.1.275, add the marketplace first:

```shell
/plugin marketplace add goodtech-llc/insider-trades-mcp
/plugin install sec-daily@goodtech
```

The `goodtech` marketplace lists every GoodTech plugin; it lives in the Insider
Trades repository. If you already added it for Insider Trades, run
`/plugin marketplace update goodtech` and install.

The install asks for your API key and keeps it in your system's secure
credential store, not in a settings file. To change it later, run `/plugin`,
open SEC Daily on the **Installed** tab and choose **Configure**.

The plugin points at the hosted server at `https://api.secdailyapi.com/mcp`, so
there is nothing to install locally. You can also add the hosted server
directly, without the plugin or its skill:

```shell
claude mcp add --transport http sec-daily https://api.secdailyapi.com/mcp \
  --header "x-api-key: $SEC_DAILY_API_KEY"
```

### Cursor / Windsurf / Other MCP Clients

Clients that connect to remote MCP servers can use the hosted URL
`https://api.secdailyapi.com/mcp` with your key in an `x-api-key` header.
Clients that run servers as a local command take the same block as Claude
Desktop above.

---

## What the AI can do

Once configured, your AI assistant can answer questions like:

- *"Show me Apple's latest 10-K filing"*
- *"What 8-K filings did Tesla submit this week?"*
- *"Find all S-1 filings from the last 30 days"*
- *"Look up NVIDIA's company profile and CIK"*
- *"Get the latest SEC press releases"*
- *"Show me Microsoft's 10-Q from last quarter"*
- *"Find all Form 4 insider filings for Amazon this month"*

---

## Tool reference

### `search_filings`

Search and filter SEC EDGAR filings across all form types.

| Parameter | Type | Description |
|---|---|---|
| `ticker` | string | Company ticker, e.g. `"AAPL"` |
| `cik` | string | Company CIK (numeric) |
| `accessionNumber` | string | Exact SEC accession number |
| `formTypes` | string \| string[] | e.g. `"10-K"`, `["10-K","10-Q"]`, `"8-K"`, `"4"`, `"13F-HR"` |
| `filingDate` | string | Exact date `YYYY-MM-DD` |
| `filingDateStart` | string | Date range start `YYYY-MM-DD` |
| `filingDateEnd` | string | Date range end `YYYY-MM-DD` |
| `fieldset` | `"minimal"` \| `"standard"` \| `"full"` | Response size control |
| `limit` | number | Results per page, default 200, max 1000 |
| `cursor` | string | Pagination cursor from a previous response |

### `get_entity`

Look up a company's SEC profile. Requires either `ticker` or `cik`.

| Parameter | Type | Description |
|---|---|---|
| `ticker` | string | e.g. `"AAPL"` |
| `cik` | string | Numeric CIK string |

Returns: name, CIK, ticker, exchange, SIC code, industry, state of incorporation, fiscal year end, address, website, former names.

### `get_filing`

Fetch a single filing by ID or accession number. Requires either `id` or `accessionNumber`.

| Parameter | Type | Description |
|---|---|---|
| `id` | string | Internal filing ID |
| `accessionNumber` | string | SEC accession number |

### `get_news`

Retrieve SEC press releases and market news.

| Parameter | Type | Description |
|---|---|---|
| `newsType` | string | News category (default: `"PressReleases"`) |
| `startDate` | string | Date range start `YYYY-MM-DD` |
| `endDate` | string | Date range end `YYYY-MM-DD` |
| `limit` | number | Results (default 40, max 100) |

---

## Resources

- API docs: [secdailyapi.com/docs](https://www.secdailyapi.com/docs)
- Pricing: [secdailyapi.com/pricing](https://www.secdailyapi.com/pricing)
- Dashboard: [secdailyapi.com/dashboard](https://www.secdailyapi.com/dashboard)
- Node.js SDK: [sec-daily-api on npm](https://www.npmjs.com/package/sec-daily-api)
- Python SDK: [sec-daily-api on PyPI](https://pypi.org/project/sec-daily-api/)

---

Licensed under the [Apache 2.0 License](./LICENSE). Copyright 2026 GoodTech LLC.
