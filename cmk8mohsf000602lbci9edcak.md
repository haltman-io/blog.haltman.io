---
title: "ip.thc.org - a “Censys/Shodan” for the world of domains (5.14 billion records)"
seoTitle: "IP.THC.ORG - World's largest Internet Domain Database (5 Billion+)"
seoDescription: "A massive reverse-DNS, subdomain and CNAME intelligence platform indexing over 5.14 billion domains"
datePublished: Sat Jan 10 2026 18:18:00 GMT+0000 (Coordinated Universal Time)
cuid: cmk8mohsf000602lbci9edcak
slug: ip-thc-org-largest-dataset-of-domains-5-billions-records
cover: https://cdn.hashnode.com/res/hashnode/image/upload/v1768068616584/af0e875a-69cd-4954-ae43-f84da4acd39d.png
ogImage: https://cdn.hashnode.com/res/hashnode/image/upload/v1768068876267/040b9197-2f92-42cb-b68c-ff2772b26048.png
tags: rest-api, cli-tools, cybersecurity, network-security, osint, dns-records, threat-intelligence, attack-surface-management, cli-tool, reverse-dns, domain-intelligence, subdomain-discovery, ip-address-lookup, cname-lookup, bulk-data-analysis

---

The technical OSINT ecosystem has matured around infrastructure “search engines” (Shodan, Censys, Fofa): you query a target and pivot by banners, certificates, ports, services, fingerprints. [IP.THC.ORG](http://ip.thc.org), a new project from The Hacker’s Choice (THC), takes a different approach: the massive relationship between IPs and names (rDNS), subdomains, and CNAMEs, with a very pragmatic proposal: CLI-first, simple endpoints, monthly bulk data, and a dataset that already has 5.14 billion records.

> **Why does this matter?**
> 
> Because in investigation and Attack Surface Management, “name ↔ IP ↔ DNS records” is the glue that enables attribution, pivoting, and exposure detection, even before we talk about ports and banners.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768065875879/e57fc44e-60a6-4d02-9999-c9d05273f1bc.png align="center")

---

## What is [ip.thc.org](http://ip.thc.org), in practice

Think of [ip.thc.org](http://ip.thc.org) as a giant index for answering questions such as:

* “Which hostnames perform reverse DNS for this IP?” (infrastructure pivot)
    
* “What subdomains exist for this apex domain?” (surface mapping)
    
* “What domains point (CNAME) to this target?” (detection of dependencies and possible takeovers)
    

The most interesting part is that it comes with three layers of consumption:

1. **CLI-friendly via cURL**, with colored output and useful headers
    
2. **REST API (JSON) + CSV downloads** for integration into pipelines
    
3. **Monthly bulk data (CSV/Parquet)** for offline analysis at scale (DuckDB recommended)
    

And, on the “sources and intake” side, the project documentation explains that rDNS is “powered by” **Segfault**, **Domainsproject**, and **CertStream-Domains**.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768067692788/eadb7129-3f23-4a62-b037-71228a76d91e.png align="center")

---

## Numbers and distribution of the dataset (what you can download)

The **Bulk Data Access** doc publishes clear and useful statistics for planning:

* **Last updated:** January 2, 2026
    
* **Date for:** December 2025
    
* **Records:** **5.14 billion**
    
* **Size (compressed):** Parquet ~40GB / CSV ~30GB
    
* **Size (uncompressed):** Parquet ~60GB / CSV ~190GB
    

The model is: **a complete dump at the end of each month**, with direct download links (CSV and Parquet).

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768067758863/e03355c2-256c-40d9-ac8f-cf1388fcca7b.png align="center")

---

## Layer 1: CLI-friendly (cURL) — fast, auditable, scriptable

### 1) rDNS: IP → hostnames

Direct example (limiting return):

```bash
curl 'https://ip.thc.org/1.1.1.1?l=10'
```

You get useful context in the header (ASN, org, approximate geo) and then the list of entries. The doc itself shows **rate limit** and filter options.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768067840568/96c32148-efd4-4748-8481-b5e9b5af38bb.png align="center")

### 2) Subdomain lookup: apex → subdomains

```bash
curl 'https://ip.thc.org/sb/wikipedia.org?l=20'
```

In the documentation, the subdomain endpoint also has a rate limit and suggests pivots (e.g., go to CNAME lookup).

### 3) CNAME lookup: target → domains that point to it

```bash
curl 'https://ip.thc.org/cn/github.io?l=20'
```

Useful for discovering dependencies, frontdoors, and even takeover hypotheses (always validating with provider rules and the actual status of the resource).

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768067908835/2deca9f4-207a-421e-9abc-fb7cf436ecf5.png align="center")

---

## Layer 2: API (JSON) and CSV downloads — integration into pipelines

The CLI-friendly documentation also lists API endpoints that you can put directly into automations (SOAR, enrichers, ETL, etc.):

### Lookup by IP (includes /24, /16, /8 blocks)

```bash
curl 'https://ip.thc.org/api/v1/lookup' \
  -X POST \
  -d '{ "ip_address":"1.1.1.0/24", "limit": 10 }' -s
```

### Subdomain lookup by domain

```bash
curl 'https://ip.thc.org/api/v1/lookup/subdomains' \
  -X POST \
  -d '{ "domain":"github.com", "limit": 10 }' -s
```

### CNAME lookup by target

```bash
curl 'https://ip.thc.org/api/v1/lookup/cnames' \
  -X POST \
  -d '{ "target_domain":"google.com", "limit": 10 }' -s
```

And when you want something that fits into a spreadsheet/SIEM/grep, there are **CSV download** endpoints with a high `limit` (up to 50k) and an option to hide the header.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768068015953/4a7d8f5f-371a-4367-b491-a853e7a89964.png align="center")

---

## Layer 3: Bulk data (Parquet/CSV) — “build your own engine”

If you want **scale**, the route is to download the monthly dump and query locally. The project itself recommends **DuckDB** and gives a direct query example in Parquet: (\[IP THC\]\[7\])

```bash
duckdb
select * from 'rdns.parquet' where ip_address='1.1.1.1' limit 10;
```

This opens the door to:

* internal enrichment (Threat Intel / ASM)
    
* historical analysis by month
    
* indexing in ClickHouse/Elastic/OpenSearch
    
* correlation with CT logs / passive DNS / proxy logs / EDR
    

---

## “Where does this come from?” (public clues on the trail)

Two pieces of the ecosystem help to understand the type of intake/expansion of the project:

* The old **CertStream-Domains** repository (daily dumps of domains observed in certificate transparency) was **archived** with the note that **THC “stepped up to overtake & expand the data”**, and points to **cs1/cs2** as the source of the daily dumps.
    
* The **dnsstream** utility (from THC itself) captures DNS traffic and “displays the answers,” explicitly described as “part of the [ip.thc.org](http://ip.thc.org) project.”
    

This alone does not “prove” the entire internal pipeline (nor should it—opsec and abuse exist), but it does indicate a coherent design: **aggregation + continuous observation + publication**.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768068085475/09003c07-b2fd-4b1a-8931-581e1e3159d7.png align="center")

---

## Real use cases (where it shines)

### 1) Infrastructure pivoting (IR / Threat Intel)

You start with a suspicious IP (IOC), extract rDNS, cross-reference with subdomains and CNAME, and arrive at:

* exposed frontends / administrative areas
    
* “forgotten” domains pointing to old infrastructure
    
* third-party dependencies (CDN, storage, PaaS)
    

### 2) Attack Surface Management (ASM) without relying on heavy scanners

Before scanning ports, you build a list of hostnames/subdomains and prioritize:

* patterns like “dev, staging, admin, old, beta”
    
* newly discovered assets (when combined with daily/monthly datasets)
    

### 3) Hunting for dangling CNAME / misconfig

CNAME lookup helps answer “who points to X?” and “which domains depend on a target.” This speeds up screening in bug bounty programs — with responsible validation.

---

## Rate limiting, ethics, and best practices

The example responses themselves show rate limiting (e.g., “You can make 249 requests... replenishes at 0.50/sec”), so treat it as a public service: local cache, backoff, and bulk data when you need volume.

And the THC context also matters: the group has a historical culture of research/hacking “without trying to get rich,” with a strong community and tooling bias.

---

## Conclusion: where [ip.thc.org](http://ip.thc.org) fits into your stack

If Shodan/Censys are “service search engines,” [**ip.thc.org**](http://ip.thc.org) is the foundation block for **name intelligence**:

* fast for pivots (CLI)
    
* integrable (API/CSV)
    
* scalable (monthly Parquet + DuckDB) (\[IP THC\]\[1\])
    

In 2026, with **5.14B records** published and a very objective distribution model, it is worth adding [ip.thc.org](http://ip.thc.org) to your OSINT kit — especially if you work with **ASM, Threat Intel, IR**, or responsible offensive research.

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768068144901/71ec11d3-3fa1-4efa-b651-f443d02b60ba.png align="center")

---

## References

* [Bulk Data Access](https://ip.thc.org/docs/bulk-data-access/)
    
* [Commandline Access](https://ip.thc.org/docs/cli)
    
* [rDNS Lookup](https://ip.thc.org/docs/docs)
    
* [Reverse DNS Lookup](https://ip.thc.org/docs/cli-rdns-lookup)
    
* [Subdomain Lookup](https://ip.thc.org/docs/cli-subdomain-lookup)
    
* [CNAME Lookup](https://ip.thc.org/docs/cli-cname-lookup)
    
* [Accessing parquet files](https://ip.thc.org/docs/bluk-data-parquet)
    
* [CertStream-Domains – Daily Dumps of Certificate Logs Subdomains](https://github.com/pkgforge-security/CertStream-Domains)
    
* [dnsstream – Network Capture DNS answers](https://github.com/SkyperTHC/dnsstream)
    
* [The Hacker’s Choice – 30 years of hacking without trying to get rich](https://www.redhotcyber.com/en/post/thc-30-years-of-hacking-without-trying-to-get-rich/)