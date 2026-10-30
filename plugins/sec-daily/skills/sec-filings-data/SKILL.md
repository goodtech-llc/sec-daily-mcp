---
name: sec-filings-data
description: "How to answer questions from SEC EDGAR filings correctly with the sec-daily tools: finding the right company and filing, paging, reading a long filing's text, and the ways a query returns a confident wrong answer. Use whenever answering questions about a company's 10-K, 10-Q, 8-K, S-1, proxy or other SEC filings, what a filing says, when it was filed, or SEC press and enforcement news."
---

# Working with SEC filings

Five tools:

- `search_filings`: which filings exist. One row per filing, newest first.
- `get_filing`: one filing's details, documents and links (and an AI summary on
  Pro plans and above).
- `read_filing`: a filing's text, a slice at a time.
- `get_company`: a company's profile, and the way to turn a name into a ticker
  or CIK.
- `get_sec_news`: the SEC's own press releases, enforcement and rule news.

The usual path is company, then `search_filings`, then `get_filing` or
`read_filing` for the one that answers the question.

## Get the company right first

- Search by **ticker** or **CIK**. `get_company` also takes a name, but only the
  exact registered name ("Apple Inc.", "MICROSOFT CORP"), with no fuzzy match.
  If a name finds nothing, ask for or infer the ticker rather than concluding the
  company does not file.
- One company can have several share classes and tickers but has one CIK. When a
  ticker gives odd results, look the company up and search by CIK.

## The ways to get a confident wrong answer

**1. Treating the first page as the whole answer.** A result with `hasMore`
has more filings that match. Any count or "latest" claim from that page alone
can be wrong. Page with `nextCursor` and the same filters, or narrow the dates.
Never say "there were 25 filings" when 25 is the page size.

**2. Searching with no company, form type or date.** That covers only the last
five days of filings across the whole market. For anything older or broader,
give dates, a form type or a company.

**3. Forgetting amendments.** Form types match exactly: `10-K` does not include
`10-K/A`, and `8-K` does not include `8-K/A`. When the question is "all annual
reports" or "the latest numbers", include the amendment form too
(`formTypes: "10-K,10-K/A"`) and say which one you used.

**4. Reading a plan limit as "no filings".** History depends on the plan: free
keys reach back one year, Plus three years, Pro ten, Ultra to 2015. Ask for a
range beyond that and the tool says so, naming the earliest date allowed. Relay
that; do not report an empty result. Section reading needs Ultra, and AI
summaries need Pro or above: their absence is the plan, not the filing.

**5. Mixing up the dates.** `filed` is when the filing reached EDGAR; `period`
is the period it reports on (a fiscal quarter or year end, or the event date
for an 8-K). A 10-K for fiscal 2025 is usually filed in 2026. Say which date an
answer is about. Dates are US Eastern time.

## Reading a filing

- Check `textChars` from `search_filings` or `get_filing` before reading: a
  10-K's text is often several hundred thousand characters.
- `read_filing` returns 20,000 characters at a time. When the result has
  `nextOffset`, call again with it to continue. Read only as far as the question
  needs, and say so if you stopped before the end.
- On the Ultra plan, `section` returns one item directly: for a 10-K, `1`
  (business), `1A` (risk factors), `7` (MD&A), `8` (financial statements); for a
  10-Q, `2` is MD&A and `1A` risk factors in Part II; for an 8-K, the item
  number such as `2.02` (results) or `5.02` (officer and director changes).
- Quote what the filing says, and link the document (`document` or the SEC.gov
  links from `get_filing`) so the user can check it.

## 8-K items

An 8-K's `items` field says what it is about. Common ones: `1.01` material
agreement, `2.02` results of operations, `5.02` departure or appointment of
officers or directors, `5.07` shareholder vote results, `7.01` Regulation FD,
`8.01` other events, `9.01` exhibits. Search cannot filter by item; search 8-Ks
for a company or a short date range and read the `items` on each row.

## What this data is not

- **Forms 3, 4 and 5 are insider-ownership filings.** Here they are listed as
  filings, not parsed into who bought or sold how much. For that, use the
  Insider Trades plugin or connector.
- **SEC news is the SEC's own announcements**, not market news about a company.

## Answering well

- Say which filings you looked at: form, company, filing date and a link.
- Say whether more results matched than you read.
- Prefer the filing's own words over paraphrase for anything material, and
  separate what the filing states from your summary of it.
- This is filing data, not investment advice. Describing what a company
  disclosed is useful and honest; recommending a trade from it is neither.
