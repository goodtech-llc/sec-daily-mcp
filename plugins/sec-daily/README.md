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

Install from the GoodTech marketplace in Claude Code:

```shell
/plugin install sec-daily --marketplace goodtech-llc/sec-daily-mcp
```

You need an SEC Daily API key. Free keys are available from your
[dashboard](https://www.secdailyapi.com/dashboard); paid plans add history and
higher limits.

Claude Code asks for the key when you install the plugin and keeps it in your
system's secure credential store. To change it later, run `/plugin`, open
SEC Daily on the **Installed** tab and choose **Configure**.

Requests go to the hosted server at `https://api.secdailyapi.com/mcp` and count
toward your API plan. Nothing runs locally.

## Things to ask

- "What did Nvidia say about risks in its latest 10-K?"
- "List Tesla's 8-K filings from the last three months and what each was about."
- "Summarize Apple's most recent 10-Q."
- "What enforcement actions did the SEC announce this month?"

## Notes

This is filing data, not investment advice. Free keys reach back one year;
paid plans reach back further.

Support: support@secdailyapi.com · [Documentation](https://www.secdailyapi.com/docs) ·
License: Apache-2.0
