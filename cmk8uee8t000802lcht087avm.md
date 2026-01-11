---
title: "Free Mail Forwarding (Haltman.io): the modern fork of the classic THC service — and why it matters"
seoTitle: "New Free Mail Forwarding Service"
seoDescription: "A modern, open-source mail forwarding infrastructure focused on privacy, simplicity, and auditability."
datePublished: Sat Jan 10 2026 21:54:06 GMT+0000 (Coordinated Universal Time)
cuid: cmk8uee8t000802lcht087avm
slug: free-mail-forwarding-takeover-hackerschoice-free-mail-forwarding
cover: https://cdn.hashnode.com/res/hashnode/image/stock/unsplash/LPZy4da9aRo/upload/a030067361b26b622f71b8c5abc8e72f.jpeg
ogImage: https://cdn.hashnode.com/res/hashnode/image/upload/v1768081966001/a34cf2bb-9f76-42f5-9cbe-763742d40925.png
tags: opensource, privacy, infrastructure, postfix, cybersecurity, aliases, email-security

---

Email *alias* services (SimpleLogin, [addy.io](http://addy.io), etc.) exist for one simple reason: **your “real” email address becomes a universal identifier**. It leaks, it is correlated, it becomes a target for *phishing*, *credential stuffing*, aggressive marketing, and *doxxing*.

The most straightforward alternative is to separate identities: **one alias per service**.

The **Free Mail Forwarding Service** project by the [**Haltman.io**](http://Haltman.io) addresses exactly this point: **creating aliases in the format** `handle@domain` and forwarding everything to a mailbox that you control — with a minimalist (pure forwarding), open-source, infrastructure-focused model.

---

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768080312058/eae41cca-d766-4b4d-917e-688b4161d701.png align="center")

---

## The origin: The Hacker’s Choice (THC) “Free Mail Forwarding Service”

Before the current hype surrounding alias managers, the community already had “old school” solutions. The Hacker’s Choice (THC) maintained a public forwarding service and its current status is clear: **the service is unavailable** because the volunteer who operated it has “disappeared,” and THC itself is asking for someone to take over the operation.

[Haltman.io](http://Haltman.io)'s proposal here is pragmatic: **take the concept that already worked, modernize and repackage it** (stack + API + UI), maintaining the “infrastructure first” spirit.

---

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768080172757/ac6b50b0-1b7d-400d-8a29-88272af43873.png align="center")

---

## What [Haltman.io](http://Haltman.io)'s Free Mail Forwarding does (and what it does not attempt to do)

The model is straightforward:

* You choose:
    
    * **handle** (local-part),
        
    * **domain** (one of the available ones),
        
    * **destination** (your actual inbox)
        
* The system **sends a confirmation email** to the destination
    
* after confirming, **any email to** `handle@domain` is forwarded to the destination
    

This design places the service in the “forwarding” category (below), not “mail provider.” The project’s architecture itself makes this clear: **the Node.js API does not receive email, it only manages rules (aliases) in the database that Postfix queries**.

---

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768080058318/73bbe54c-b141-4576-8339-1785a63edba3.png align="center")

---

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768080340954/19145d43-8338-4c4d-8ec2-3ff90fd35857.png align="center")

---

## Architecture (no magic, no “nebulous SaaS”)

The service stack is divided into three layers:

### 1) Base mail stack (MTA + database)

* **Postfix** as MTA
    
* **MariaDB** with **domain** and **alias** tables (dynamic routing)
    
* **PostSRSd** for SRS (I'll explain why this is critical below)
    

### 2) Public API (alias lifecycle control)

An API in **Node.js + Express** exposes endpoints for:

* requesting alias creation (`/forward/subscribe`)
    
* confirming via token (`/forward/confirm`)
    
* requesting removal (`/forward/unsubscribe`)
    
* confirming removal (`/forward/unsubscribe/confirm`)
    

And an important security/implementation detail: **everything is via GET + querystring** (no JSON body).

### 3) UI (user experience)

A modern UI (Next.js + ShadCN + Tailwind) serves as a “front door” to generate requests and facilitate use, without hiding how it works.

---

![dumb diagram](https://github.com/haltman-io/mail-forwarding/raw/main/github/screenshots/dumb-diagram.png align="center")

---

## The difference between “amateur forwarding” and “forwarding that delivers”: SRS (PostSRSd)

When you forward email, **SPF/DMARC often break** at the final destination: the recipient's provider sees the email “coming” from your server, but the original envelope/identity does not authorize your IP → rejections, quarantine, or spam folder.

That's why the stack includes **SRS**: it **rewrites the sender envelope** in a forwarding-compatible way, reducing rejections by SPF/DMARC policies.

---

![Sender Rewriting Scheme - Mythic Beasts](https://blog.mythic-beasts.com/wp-content/uploads/2017/10/srs-3.png align="center")

---

![A guide to DKIM syntax– create your DKIM record for free - DuoCircle](https://www.duocircle.com/wp-content/uploads/2024/07/DMARC-reporting-service-2.jpg align="left")

---

## Confirmation flow and anti-abuse controls (what I liked here)

Public service + free aliases = **inevitable abuse**. The project solves this with a very classic (and effective) set of mechanisms:

* **email confirmation via token** (no rule enters without confirmation)
    
* **rate limiting and throttling** by IP, alias, destination, and token
    
* HTTP responses with clear codes (e.g., `alias_taken`, `rate_limited`, `banned`, `token_expired`)
    
* **Redis** option for distributed rate limiting in production (avoids limit resets in multi-instance environments)
    

This is the “bare minimum” required to prevent a public service from becoming a spam forwarder within 48 hours.

---

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768080703362/dd4bb754-4aab-43d5-90e1-182ecb062496.png align="center")

---

## Operating (or self-hosting) requires correct DNS — and here is the checklist

Even if you only “use” the service, understanding DNS helps you diagnose delivery. And if you are going to operate your own instance, DNS is mandatory.

The project guide makes the basics clear for each domain:

* MX pointing to the mail host
    
* A/AAAA of the host
    
* SPF authorizing the IPs
    
* DMARC (start permissive)
    
* PTR/reverse DNS for outbound deliverability
    

And there are objective instructions on how to point **domain** or **subdomain** to the mail host (with examples of MX/SPF/DMARC): [https://github.com/haltman-io/mail-forwarding/blob/main/FWD-Add-Domain-or-Subdomain.md](https://github.com/haltman-io/mail-forwarding/blob/main/FWD-Add-Domain-or-Subdomain.md)

---

![](https://cdn.hashnode.com/res/hashnode/image/upload/v1768080799810/8b3d09ba-06b3-42fe-8ec2-6237473978ec.png align="center")

---

## How does it compare to SimpleLogin and [addy.io](http://addy.io) (in practice)?

SimpleLogin and [addy.io](http://addy.io) are benchmarks in the alias manager ecosystem, focusing on a complete experience and extra features.

* **SimpleLogin** positions itself as an alias service to protect your inbox, and is explicitly **open source**.
    
* [**addy.io**](http://addy.io) describes its core as “creating unlimited aliases and protecting your real email” (also in the spirit of privacy-first).
    

The difference with **Free Mail Forwarding (**[**Haltman.io**](http://Haltman.io)**)** is another: **minimal infrastructure, auditable flow, and focus on forwarding**:

* you are not “buying an ecosystem”, you are using a **simple mechanism** (alias → forward) supported by Postfix+DB and a management API.
    
* This tends to appeal to those who prefer:
    
* predictability,
    
* smaller attack surface,
    
* and “hacker mode”: understanding exactly what is running.
    

The natural tradeoff: services like SimpleLogin usually offer extra layers (apps, integrations, advanced features), while here the proposal is to **be the solid foundation of forwarding**.

---

## Conclusion: why this project is relevant

The THC page reveals an uncomfortable truth: **community services die when their operation depends on a single person**. What [Haltman.io](http://Haltman.io) is doing? packaging base stack + API + UI, with anti-abuse controls and practical documentation. Is the right way to **take “free mail forwarding” out of urban legend mode and bring it into a reproducible operation**.

If you:

* want to reduce correlation of your real email,
    
* want simple aliases per domain,
    
* or want an open-source base to run on your own,...
    

this project is a must-read.

---

* [Haltman – Home](https://haltman.io/)
    
* [Haltman – About](https://www.haltman.io/about-us)
    
* [THC Free Mail Forwarding Service](https://www.thc.org/mail/)
    
* [SimpleLogin – Open-source anonymous email service](https://simplelogin.io/?utm_source=chatgpt.com)
    
* [addy.io](http://addy.io) [– Free, open-source anonymous email forwarding](https://addy.io/?utm_source=chatgpt.com)
    
* [Mail Forwarding API Repository](https://github.com/haltman-io/mail-forwarding)
    
* [Mail Forwarding UI Repository](https://github.com/haltman-io/mail-forwarding-ui)
    
* [Base Stack Documentation (FWD-Basestack)](https://github.com/haltman-io/mail-forwarding/blob/main/FWD-Basestack.md)
    
* [DNS Domain/Subdomain Documentation](https://github.com/haltman-io/mail-forwarding/blob/main/FWD-Add-Domain-or-Subdomain.md)