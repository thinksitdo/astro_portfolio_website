---
title: "Apex: re-focusing an MVP backlog on user needs"
kind: case
type: protected
categories: ["UX Strategy"]
client: "KiteEdge"
role: "UX consultant, then the only UX resource on the MVP"
activities: "UX strategy, backlog validation, user interviews, personas and journey maps, rapid prototyping, composable search design"
year: "2018"
legacyUrl: "https://scottrobinson.co.uk/project/apex-focusing-an-mvp-backlog-on-user-needs/"
order: 3
task: "Turn an unowned, untested backlog into a focused MVP."
intro: "I worked on Apex, KiteEdge's first MVP, a search platform for asset owners built on graph ontologies. Their backlog had grown large with nobody owning it, and none of it had been tested against user needs. First as a UX consultant and then as the only UX resource, I focused it on what users needed, and we delivered the MVP with rapid prototyping built into the development cycle."
excerpt: "Turning an unowned, untested backlog into a focused MVP for KiteEdge."
heroImage: "/media/apex-hero.jpg"
heroAlt: "Apex backlog displayed on office wall"
heroPortrait: ""
thumbnail: "/media/apex-thumbnail.jpg"
---

## A big vision, and a backlog nobody owned

KiteEdge is a fintech start-up building a financial research search platform that helps asset managers make informed investment decisions. Its search layer combines ontological relationships, complex Boolean queries and graph-based machine learning. Research data was siloed, and Apex set out to remove those silos.

I'd already worked with the company on early UI assets and video prototypes to show its vision to investors. That led to a larger role: developing and running a UX strategy to get the MVP delivered.

The company had a big vision and a huge feature backlog, but nobody owned it. Items were duplicated or poorly documented, and none had been validated against user or market needs, so prioritisation was guesswork.

Some wireframes existed but hadn't been tested. Commercial and development teams didn't share a clear picture of what the MVP needed. I was the only UX resource, so the approach had to be lean and fit the existing development process.

![Apex backlog taken from Jira, rewritten and displayed in the office](/media/apex-backlog-1.jpg "Apex backlog taken from Jira, rewritten and displayed in the office")
![UX strategy based on Zen Ex Machina two track model](/media/apex-process.jpg "UX strategy based on Zen Ex Machina two track model")


## Two learning tracks, running in parallel

We set up a project room to make the backlog visible. Each item was de-duplicated, rewritten and grouped.

I then built the UX strategy on a model from Zen Ex Machina, which runs two learning tracks in parallel.

A long-cycle learning track. Interviews with prospective users and users of comparable products produced personas and user journey maps, and let us validate and prioritise the backlog against real needs. They showed that data was siloed and research had become commoditised: everyone had access to the same reports, so the edge lay in the relationships between them. What worried analysts was what they didn’t know: the connections nobody had spotted yet. Expertise inside their own organisations was often unknown too. Alongside conversations with customers, partners and investors, the research also made clear that we couldn’t compete with established search tools feature for feature. From these insights I worked with the IT Director to define four core functions for the alpha build: core search, core topics, core suggestions and core ontology.
A short-cycle learning track. I rapidly prototyped ideas in Sketch and InVision to validate designs for each user story before it entered the next sprint. Video prototypes were also used in user interviews to explain complex concepts.

Finding internal experts through user data in the same graph was on the backlog too. It relied on usage data, so it stayed out of the MVP and was never built.

![UX strategy based on Zen Ex Machina two track model](/media/apex-process.jpg "UX strategy based on Zen Ex Machina two track model")
![Core requirements defined based on user interviews and group for MVP](/media/apex-backlog-cleaned.jpg "ore requirements defined based on user interviews and group for MVP")

## Boolean search for people who don't know Boolean

The hardest design problem was search, which carried two of KiteEdge's USPs. Anyone should be able to build complex Boolean queries without knowing Boolean. And users should be able to explore a visual ontology of search terms to find connections they might not have thought of.

I designed composable search blocks that could be shown either as pure Boolean or as simpler form elements. The blocks also gave advanced users a visual hierarchy for very complex queries.

![Prototype showing different stages of a boolean block search](/media/apex-search-blocks.png "Figure 3: Prototype showing different stages of a boolean block search")
![Prototype showing ontology viewer](/media/apex-ontology-gold-mining.png "Prototype showing ontology viewer")

![Close perspective of boolean blocks UI](/media/apex-blocks-perspective.jpg "lose perspective of boolean blocks UI")

![Still from boolean search concept video](/media/apex-video-still-1.jpg "Still from boolean search concept video")
![Still from boolean search concept video](/media/apex-video-still-2.jpg "Still from boolean search concept video")

##One result card for every source

Apex had to show research from whatever tools a client already used, in one list of search results. M&G was the first case. Its meetings, meeting notes and flash notes came from FactSet, and its stock reviews came from CodeRed, and the two were structured very differently.

I designed a generic result card that any source could fill. Each card has a title, an entity type, a line of primary metadata listed in a defined order of priority, and a summary, usually pulled from the attachment. When a keyword search is used, the summary becomes a collation of the passages that mention the term. Secondary metadata, such as the covering analyst, region and sector in FactSet, appears only in the sidebar.

The CodeRed stock reviews showed how uneven real data could be. Some had ratings, outlook, risk, sector and analyst, while others had only a country and a related company. The card had to read well either way, so metadata truncates at the end of its line rather than spilling onto a second one.

![Apex search results item had to accept data from many sources](/media/apex-generic-search-item-1.jpg "Apex search results item had to accept data from many sources")
![Some of those sources often contained missing or incomplete data](/media/apex-generic-search-item-2.jpg "Some of those sources often contained missing or incomplete data")

## An MVP focused on relationships

The strategy helped the business deliver its MVP, focused on relationships. It had a visually navigable graph built on GICS and our own industry knowledge, and search suggestions drawn from keyword relationships in the graph. Composable search blocks made Boolean search available to any user, and search results linked through to the sections of each document that made it relevant.

Internal resistance to interviewing prospective users and market experts was overcome, which led to better backlog prioritisation. Shared physical workspaces improved communication between business and development teams, and rapid prototyping became part of the existing development cycle.
