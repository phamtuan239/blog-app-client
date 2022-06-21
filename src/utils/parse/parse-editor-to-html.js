import "./parse.scss";

const sanitizeHtml = function (markup) {
  markup = markup.replace(/&/g, "&amp;");
  markup = markup.replace(/</g, "&lt;");
  markup = markup.replace(/>/g, "&gt;");
  return markup;
};

const templateBlock = (elements) => {
  const html = elements.reduce((element, def) => {
    return def + (element + "\n");
  }, "");
  return `<div class="ce-block">
    <div class="ce-block__content">
    ${html}
    </div>
    </div>
    `;
};

const embedMarkups = {
  youtube: `<div class="embed"><iframe class="embed-youtube" frameborder="0" src="<%data.embed%>" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen <%data.length%>></iframe></div>`,

  twitter: `<iframe <%data.length%> style="margin: 0 auto;" frameborder="0" scrolling="no" allowtransparency="true" src="<%data.embed%>"></iframe>`,

  instagram: `<iframe <%data.length%> style="margin: 0 auto;" frameborder="0" scrolling="no" allowtransparency="true" src="<%data.embed%>"></iframe>`,

  codepen: `<div class="embed"><iframe <%data.length%> scrolling="no" src="<%data.embed%>" frameborder="no" loading="lazy" allowtransparency="true" allowfullscreen="true"></iframe></div>`,

  defaultMarkup: `<div class="embed"><iframe src="<%data.embed%>" <%data.length%> class="embed-unknown" allowfullscreen="true" frameborder="0" ></iframe></div>`,
};

let defaultParsers = {
  paragraph: function (data) {
    let alignment = data.alignment;
    let elements = [];
    elements.push(
      `<p style="text-align:${alignment}">${data.text}</p>`
    );
    return templateBlock(elements);
  },
  header: function (data) {
    let elements = [];
    elements.push(`<h${data.level}>${data.text}</h${data.level}>`);
    return templateBlock(elements);
  },
  embed: function (data) {
    let elements = [];
    data.length = `width="100%" height="500px"`;
    const regex = new RegExp(/<%data\.(.+?)%>/, "gm");
    if (embedMarkups[data.service]) {
      if (data.service === "instagram") {
        data.length = `width="100%" height="800px"`;
      } else if (data.service === " twitter") {
        data.length = `width="100%" height="450px"`;
      }
      if (data.caption.trim().length > 0) {
        elements.push(`<div className='caption'>${data.caption.trim()}</div>`);
      }
      elements.push(
        embedMarkups[data.service].replace(regex, (match, p1) => data[p1])
      );
      return templateBlock(elements);
    } else {
      if (data.caption.trim().length > 0) {
        elements.push(`<div className='caption'>${data.caption.trim()}</div>`);
      }
      elements.push(
        embedMarkups["defaultMarkup"].replace(regex, (match, p1) => data[p1])
      );
      return templateBlock(elements);
    }
  },
  image: function (data) {
    let elements = [];
    if (data.caption.trim().length > 0) {
      elements.push(`<div className='caption'>${data.caption.trim()}</div>`);
    }
    elements.push(`
    <div className="cdx-simple-image__picture">
    <img src=${data.file.url} alt="image">
    </div>
    `);
    return templateBlock(elements);
  },
  simpleImage: function (data) {
    let elements = [];
    if (data.caption.trim().length > 0) {
      elements.push(`<div className='caption'>${data.caption.trim()}</div>`);
    }
    elements.push(`
    <div className="cdx-simple-image__picture">
    <img src=${data.url} alt="image">
    </div>
    `);
    return templateBlock(elements);
  },
  imageGallery: function (data) {
    let elements = [];
    let images = data.urls
      .reverse()
      .map((url, index) => {
        return `<img id="gg-img-${index}" src=${url}></img>`;
      })
      .reduce((element, def) => {
        return def + (element + "\n");
      }, "");

    let ggBox = "";
    if (data.layoutSquare) {
      ggBox = `<div class="gg-box" id="square" data-layout="square">
        ${images}
        </div>`;
    } else if (data.layoutWithFixedSize) {
      ggBox = `<div class="gg-box" id="heightWidth" style="--row-height:180px; --column-width:280px;">
      ${images}
      </div>`;
    } else if (data.layoutHorizontal) {
      ggBox = `<div class="gg-box" id="horizontal" data-layout="horizontal">
      ${images}
      </div>`;
    } else {
      ggBox = `<div class="gg-box" id="gap" style="--gap-length:10px;">
      ${images}
      </div>`;
    }
    const element = `
<div class="image-gallery">
<div class="gg-container" id="image-gallery-2">
${ggBox}
</div>
</div>
    `;
    elements.push(element);
    return templateBlock(elements);
  },
  list: function (data) {
    let elements = [];
    const type = data.style === "ordered" ? "ol" : "ul";
    const items = data.items.reduce(
      (acc, item) => acc + `<li>${item}</li>`,
      ""
    );
    elements.push(`<${type}>${items}</${type}>`);
    return templateBlock(elements);
  },
  table: function (data) {
    let elements = [];
    let rows = [];
    if (data.content.length > 0) {
      rows = data.content.map((row) => {
        return `<tr>${row.reduce(
          (acc, cell) =>
            acc +
            `<td class="tc-table__cell">
            <div class="tc-table__area">
            <div class="tc-table__inp">
            ${cell}
            </div>
            </div>
            </td>`,
          ""
        )}</tr>`;
      });
    }
    const element = `
    <div class="table-selector">
    <div class="tc-editor">
    <div class="tc-table__wrap">
    <table class="tc-table">
    <tbody>
    ${rows.join("")}
    </tbody>
    </table>
    </div>
    </div>
    </div>
    `;
    elements.push(element);
    return templateBlock(elements);
  },
  codeBox: function (data) {
    let elements = [];
    const element = `
    <pre class="codeBoxHolder">
    <div class="codeBoxTextArea dark javascript hljs">
    ${data.code}
    </div>
    </pre>
    `;
    elements.push(element);
    return templateBlock(elements);
  },
  raw: function (data) {
    let elements = [];
    elements.push(data.htm);
    return templateBlock(elements);
  },
  delimiter: function (data) {
    let elements = [];
    elements.push(`
        <div class="ce-delimiter cdx-block"></div>
    `);
    return templateBlock(elements);
  },
  quote: function (data) {  
    let elements = [];
    let alignment = `style="text-align: ${data.alignment};"`;
    elements.push(`<blockquote ${alignment}><p>${data.text}</p><cite>${data.caption}</cite></blockquote>`);
    return templateBlock(elements);
  },
  code: function (data) {
    let elements = [];
    const markup = sanitizeHtml(data.code);
    elements.push(`<pre><code class="code-block">${markup}</code></pre>`);
    return templateBlock(elements);
  },
};

class EdjsParser {
  constructor() {
    this.parsers = Object.assign(defaultParsers, {});
  }

  parse(EditorJsObject) {
    const html = EditorJsObject.blocks.map((block) => {
      if (!this.parsers[block.type]) {
        return;
      }
      const markup = this.parsers[block.type](block.data, this.config);
      return markup;
    });
    return html.join("");
  }

  parseBlock(block) {
    return this.parsers[block.type](block.data, this.config);
  }
}

export default EdjsParser;
