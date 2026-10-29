# SEC Daily

Ask Claude about SEC filings from US public companies — annual and quarterly
reports, 8-K announcements, registration statements, proxy statements and every
other form on EDGAR — via the [SEC Daily API](https://www.secdailyapi.com).

The plugin adds five tools and a skill:

- **Search filings** by company (ticker or CIK), form type and filing date.
- **Get a filing**: the company, dates, 8-K items, its documents with SEC.gov
  links, and an AI summary on Pro plans and above.
- **Read a filing's text** a slice at a time, or one section such as a 10-K's
  risk factors on the Ultra plan.
- **Look up a company**: CIK, ticker, exchange, industry, fiscal year end and
  former names.
- **SEC news**: press releases, litigation releases, administrative proceedings
  and trading suspensions.
- **A skill** that teaches Claude how this data behaves: paging through results
  instead of reporting the first page as a total, filing date versus period of
  report, why an unfiltered search covers only a few days, and which limits come
  from your plan rather than from the data.

## Setup

In Claude Code:

```shell
/plugin install sec-daily --marketplace goodtech-llc/sec-daily-mcp
```

Nothing to configure. The first time Claude uses a tool, it asks you to sign in
to SEC Daily (the same account as the website; creating one takes a minute). If
you don't have an API key yet, one is created for you on your plan, free unless
you've upgraded.

In Claude Code, if the sign-in window does not open by itself, run `/mcp`,
choose the SEC Daily server and pick **Authenticate**. In Cowork and the Claude
apps, connect it from the plugin's **Connectors** tab.

Requests go to the hosted server at `https://api.secdailyapi.com/mcp` and count
toward your plan. Nothing runs locally.

**Prefer an API key?** Add the server yourself instead of using the plugin:
`claude mcp add --transport http sec-daily https://api.secdailyapi.com/mcp --header "x-api-key: YOUR_KEY"`
(keys at your [dashboard](https://www.secdailyapi.com/dashboard)).

## Things to ask

- "What did Nvidia say about risks in its latest 10-K?"
- "List Tesla's 8-K filings from the last three months and what each was about."
- "Summarize Apple's most recent 10-Q."
- "What enforcement actions did the SEC announce this month?"

## Notes

This is filing data, not investment advice. The free plan reaches back one
year; paid plans reach back further.

Support: support@secdailyapi.com · [Documentation](https://www.secdailyapi.com/docs) ·
License: Apache-2.0
