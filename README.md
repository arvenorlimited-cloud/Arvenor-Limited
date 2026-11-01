# Arvenor Limited multi-page website
Pages: Home, About, What We Do, Projects, Partnerships and Contact. Static HTML/CSS/JS.

The contact form opens the visitor email application using mailto:connect@arvenorlimited.com.ng. It does not send in the background or store submissions. The mailbox must be provisioned and tested.

Replace illustrative stock photography with owned/licensed images before public launch. Add only verified company details and projects.

Free hosting recommendation: Cloudflare Pages. For apex domain arvenorlimited.com.ng, add the domain as a Cloudflare zone and point nameservers to Cloudflare. Before changing nameservers at WhoGoHost, preserve existing MX, SPF, DKIM, DMARC and email verification records. Confirm mail provider DNS records first.

WhoGoHost DNS guide: https://whogohost.ng/host/knowledgebase/300/How-do-I-manage-my-domain-DNS.html
Cloudflare custom domains: https://developers.cloudflare.com/pages/configuration/custom-domains/
GitHub Pages is an alternative for public repositories on GitHub Free.


## Pages CMS connection
The site loads editable content from `/content/site.json` and published project records from the public GitHub repository collection. Deploy this repository through Cloudflare Pages with the repository root as the build output directory and no build command. CMS image fields should store paths under `media/`. The browser falls back to the approved static content if CMS data is unavailable.


Logo treatment: all page headers use the approved navy full lockup on the light header; all footers use the approved white full lockup on navy. Both include the company name and tagline.
