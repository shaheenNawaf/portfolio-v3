/* Live card previews for Sveltia CMS.
 * Renders entries the way the site does: projects as the open work-card
 * (src/components/work_card.astro), experiences as the journey row
 * (src/components/journey_row.astro). Uses the `h` and `createClass`
 * globals exposed by sveltia-cms.js — no build step, plain ES2018. */
(function () {
  var CATEGORY_LABEL = { marketing: "Growth", software: "Software", systems: "Systems" };

  function entryData(entry) {
    var plain = typeof entry.toJS === "function" ? entry.toJS() : entry;
    return (plain && plain.data) || {};
  }

  function assetUrl(getAsset, path) {
    if (!path) return null;
    var asset = typeof getAsset === "function" ? getAsset(path) : null;
    return (asset && asset.url) || path;
  }

  function initials(title) {
    return String(title || "")
      .split(/\s+/)
      .slice(0, 2)
      .map(function (w) {
        return w.charAt(0);
      })
      .join("");
  }

  var ProjectPreview = createClass({
    render: function () {
      var props = this.props;
      var d = entryData(props.entry);
      var accent = d.color || "#3b82f6";
      var metric = d.results || d.impact || d.description || "";
      var media = d.media || null;
      var thumb = media
        ? media.type === "video"
          ? media.thumbnail || null
          : media.url || null
        : null;
      var thumbUrl = assetUrl(props.getAsset, thumb);
      var chips = (d.category === "marketing" ? d.deliverables : d.tags) || [];
      var gallery = d.gallery || [];
      var domain = "";
      try {
        domain = d.liveUrl ? new URL(d.liveUrl).hostname.replace(/^www\./, "") : "";
      } catch (e) {
        domain = "";
      }
      var hasCase = Boolean(d.problem || d.solution || d.impact);

      return h(
        "div",
        { className: "pv-wrap", style: { "--card-accent": accent } },
        h(
          "div",
          { className: "work-card" },
          h(
            "div",
            { className: "pv-summary" },
            h(
              "div",
              { className: "card-media" },
              thumbUrl
                ? h("img", { src: thumbUrl, alt: "", className: "pv-thumb" })
                : h("div", { className: "pv-initials faint" }, initials(d.title))
            ),
            h(
              "div",
              { className: "card-caption" },
              h("h3", { className: "card-title" }, d.title || "Untitled"),
              metric ? h("p", { className: "card-metric" }, metric) : null,
              h(
                "div",
                { className: "card-chips" },
                h("span", { className: "card-chip" }, CATEGORY_LABEL[d.category] || d.category || ""),
                domain ? h("span", { className: "card-chip" }, domain) : null
              )
            )
          ),
          h(
            "div",
            { className: "card-body" },
            d.role
              ? h("p", { className: "pv-role faint" }, d.role + (d.date ? " \u00b7 " + d.date : ""))
              : null,
            d.problem
              ? h("div", {}, h("p", { className: "eyebrow" }, "Problem"), h("p", { className: "muted pv-text" }, d.problem))
              : null,
            d.solution
              ? h("div", {}, h("p", { className: "eyebrow" }, "Solution"), h("p", { className: "muted pv-text" }, d.solution))
              : null,
            d.impact
              ? h("div", {}, h("p", { className: "eyebrow" }, "Impact"), h("p", { className: "muted pv-text" }, d.impact))
              : null,
            hasCase
              ? null
              : h("div", { className: "muted pv-text" }, props.widgetFor("body")),
            chips.length
              ? h(
                  "div",
                  { className: "pv-chiprow" },
                  chips.slice(0, 8).map(function (t, i) {
                    return h("span", { key: i, className: "card-chip" }, t);
                  })
                )
              : null,
            media && media.type === "video" && media.url
              ? h("video", {
                  src: assetUrl(props.getAsset, media.url),
                  poster: assetUrl(props.getAsset, media.thumbnail),
                  controls: true,
                  className: "pv-video"
                })
              : null,
            gallery.length
              ? h(
                  "div",
                  { className: "card-gallery" },
                  gallery.map(function (g, i) {
                    return h("img", { key: i, src: assetUrl(props.getAsset, g), alt: "" });
                  })
                )
              : null,
            d.liveUrl || d.repoUrl
              ? h(
                  "div",
                  { className: "card-links" },
                  d.liveUrl ? h("a", { href: d.liveUrl, style: { color: accent } }, "Live \u2197") : null,
                  d.repoUrl ? h("a", { href: d.repoUrl, style: { color: accent } }, "GitHub \u2197") : null
                )
              : null
          )
        )
      );
    }
  });

  var ExperiencePreview = createClass({
    render: function () {
      var props = this.props;
      var d = entryData(props.entry);
      var accent = d.color || "#3b82f6";
      var details = d.details || [];
      var tech = d.tech || [];
      var gallery = d.gallery || [];

      return h(
        "div",
        { className: "pv-wrap" },
        h(
          "div",
          { className: "journey-item" },
          h(
            "div",
            { className: "pv-jhead" },
            h("span", { className: "journey-marker", style: { "--marker-c": accent } }),
            h(
              "div",
              { className: "pv-jtitle" },
              h("h3", { className: "fg pv-jt" }, d.title || "Untitled role"),
              h(
                "p",
                { className: "muted pv-jc" },
                [d.company, d.location].filter(Boolean).join(" \u00b7 ")
              )
            ),
            d.date ? h("span", { className: "journey-pill" }, d.date) : null
          ),
          h(
            "div",
            { className: "journey-body" },
            h("div", { className: "muted pv-text" }, props.widgetFor("body")),
            details.length
              ? h(
                  "ul",
                  { className: "pv-bullets" },
                  details.map(function (item, i) {
                    return h(
                      "li",
                      { key: i },
                      h("span", { className: "pv-dot", style: { backgroundColor: accent } }),
                      h("span", { className: "muted pv-text" }, item)
                    );
                  })
                )
              : null,
            tech.length
              ? h(
                  "div",
                  { className: "pv-chiprow" },
                  tech.map(function (t, i) {
                    return h("span", { key: i, className: "card-chip" }, t);
                  })
                )
              : null,
            d.video
              ? h("video", { src: assetUrl(props.getAsset, d.video), controls: true, className: "pv-video" })
              : null,
            gallery.length
              ? h(
                  "div",
                  { className: "pv-thumbs" },
                  gallery.map(function (g, i) {
                    return h("img", { key: i, src: assetUrl(props.getAsset, g), alt: "" });
                  })
                )
              : null
          )
        )
      );
    }
  });

  window.registerPortfolioPreviews = function (CMS) {
    CMS.registerPreviewStyle("/admin/preview.css");
    CMS.registerPreviewTemplate("projects", ProjectPreview);
    CMS.registerPreviewTemplate("experiences", ExperiencePreview);
  };
})();