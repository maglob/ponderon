var rows = []
var maxRowId = 1

window.onload = () => initialize(d3.select('div#notebook'))

function initialize(notebookContainer) {
  createRow('Math.atan(1) * 4')
  renderNotebook(notebookContainer, rows)
  evalRow(notebookContainer.select("div.row div.input"))
}

function renderNotebook(container, rows) {
  container.selectAll('div.row').data(rows)
    .attr('contentEditable', 'true')
    .text(d => d.text)
    .enter()
    .append('div')
    .classed('row', true)
    .attr('data-id', (d) => d.id)
    .append('div')
    .attr('contentEditable', 'true')
    .classed('input', true)
    .on('keyup', () => {
      if (d3.event.ctrlKey && d3.event.keyCode == 13)
        evalRow(d3.select(d3.event.target))
    })
    .text((d) => d.text)
}

function evalRow(sel) {
  execute(sel.text(), (result) => {
    result = typeof result == 'function' ? 'function: ' + result : result
    d3.select(sel.node().parentNode).selectAll('div.output')
      .data([result])
      .text(result)
      .enter()
      .append('div')
      .classed('output', true)
      .text(result)
  }, (error) => {
    console.log("error", error)
  })
}

function initialize2(input, output, error, scrapbook) {
  input.node().focus()
  input.on('keyup', (e = d3.event) => {
    if (e.ctrlKey) {
      switch (e.keyCode) {
        case 13: process(input.property('value')); break;
      }
    }
  })

  scrapbook.on('dragover', (e = d3.event) => {
        e.preventDefault();
      })
      .on('drop', (e = d3.event) => {
        var id = e.dataTransfer.getData('text/plain')
        scrapbook.append("div")
            .attr('data-id', id)
            .text(rows[id].text)
            .classed('row', true)
        e.preventDefault()
      })

  return process

  function process(str) {
    execute(str,
        function (result) {
          var row = createRow(str)
          output.append("div")
              .text(row.text)
              .classed('row', true)
              .attr('draggable', 'true')
              .attr('data-id', row.id)
              .attr('contentEditable', 'true')
              .on('dragstart', (e = d3.event) => {
                e.dataTransfer.setData('text/plain', row.id)
                e.dataTransfer.dropEffect = 'copy'
              })
            .on('keyup', (e = d3.event) => {
              if (e.ctrlKey) {
                switch (e.keyCode) {
                  case 13:
                    execute(d3.select(e.target).text(), (result) => {
                      console.log(">", result)
                      output.append('div')
                        .attr('class', 'row output')
                        .text(typeof result == 'function' ? 'function: ' + result : result)
                        .node().scrollTop = output.node().getBoundingClientRect().height
                    }, (error) => {
                      console.log("error", error)
                    })
                    break;
                }
              }
            })
          if (result != undefined) {
            output.append("div")
                .attr('class', 'row output')
                .text(typeof result == 'function' ? 'function: ' + result : result)
                .node().scrollTop = output.node().getBoundingClientRect().height
          }
          error.style('visibility', 'hidden')
          input.property('value', '')
        },
        function (e) {
          error.style('visibility', 'visible').text(e)
        })
  }
}

function createRow(str) {
  var row = {
    id: maxRowId++,
    text: str
  }
  rows.push(row)
  return row
}

function execute(str, fnSuccess, fnError) {
  try {
    fnSuccess(eval(str))
  } catch (e) {
    fnError(e)
  }
}
