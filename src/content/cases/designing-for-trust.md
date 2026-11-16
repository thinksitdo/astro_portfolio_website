---
title: "Designing for trust in AI answers"
kind: case
type: protected
categories: ["Product Design"]
client: "KiteEdge (Contours)"
role: "CPO/CXO; lead designer"
activities: "Product design, prompt engineering, React prototyping"
year: "2026"
legacyUrl: "https://scottrobinson.co.uk/project/designing-for-trust-in-ai-answers/"
order: 4
task: "Redesign citations so analysts can trust an AI answer and defend it to someone else."
intro: "Contours answers asset managers' questions from licensed research. The brief was to update citations, which hadn't changed since the MVP. Testing them, I found a bigger trust problem. When the assistant blended several documents into one paragraph, analysts who might disagree read as consensus. I redesigned the citations and wrote prompt rules to keep each analyst's view visible."
heroImage: ""
heroAlt: ""
heroPortrait: ""
thumbnail: ""
---

## When one confident voice flattens several analysts

Contours answers questions from licensed research, so every claim has to trace back to a page in a source. The citations panel didn't follow an academic numbering standard, and had no popover for quick look-up. Citations also had to show different content depending on the user's permissions: licensed, not licensed, or licence pending approval. Where access was missing, the citation needed to offer a licence request action.

When investigating the current implementation of citations, I discovered another issue. When the assistant combined material from several documents into one paragraph, even though it is cited correctly, it stripped out the context that showed where each point came from. A synthesis written in one confident voice flattened several analysts, who may disagree, into apparent consensus. That is a trust problem in how a reader views the synthesised evidence.

## From tidying a panel to defending an answer

I reframed the brief from "tidy up the citations panel" to "help an analyst decide whether to trust this answer, and defend it to someone else."

While testing current citation output, I found the synthesis problem described above. I resolved both.

## Rebuilding the citations

Inline markers follow academic conventions (Vancouver, Chicago, APA), and a style switcher changes only how citations look on screen. The System style cites at a paragraph level.

The popover let analysts step through citations within a response and within a document. It also showed the first three lines of the referenced paragraph.

I prototyped the panel directly in Claude Code as React components, built on the token-based design system.

Licensing state changes what each citation shows, depending on the user's permissions. Licensed content has no badge. Pending approval shows a clock. Unlicensed content shows a padlock, and its popover offers a licence request instead of the quote.

Feedback asked for hover-triggered popovers and full-paragraph quote expansion. I kept click-to-open and short quotes. Hover would have broken navigation between multiple citations, and the popover only needs to confirm the source and hand off to the document viewer.

Testing MMDR with a pharma research template exposed a citation numbering bug, where numbering reset at section boundaries. We fixed it by assigning marker numbers in one pass after generation, using stable per-citation IDs.

## Rules that keep each analyst visible

I wrote prompt-layer rules that require the AI to name the analyst behind each opinion, separate opinion from fact, and flag where sources disagree. I tested them by exporting reports before and after the rules and reading each one against them. Divergence flagging needed its own rule: in one case the data reached the model but wasn't flagged, so a separate rule with a trigger test fixed it.

## Promising, but not validated

The citation feature was released in both the assistant and MMDR. The numbering fix shipped, and in-body author referencing became a user-selectable feature. The release helped us win a proof of concept for a new pharma vertical using PubMed data, which needed academically rigorous citations.

On a before-and-after pair of reports, named analysts in the prose went from none to 48 lines, and interpretation was labelled explicitly seven times. These are counts of presence, not accuracy, and each run was a single generation, so the result is promising but not validated. The prompt rules were not explored further while I was at the company, but I included them in my recommendations for improvement.
