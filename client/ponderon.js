var rows = {}
var maxRowId = 1

window.onload = function () {
  var process = initialize(d3.select('textarea#console'),
      d3.select('div#output'),
      d3.select('div#error'),
      d3.select('div#scrapbook'))
  process('Math.atan(1) * 4')
}

function initialize(input, output, error, scrapbook) {
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
              .on('dragstart', (e = d3.event) => {
                e.dataTransfer.setData('text/plain', row.id)
                e.dataTransfer.dropEffect = 'copy'
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
  rows[row.id] = row
  return row
}

function execute(str, fnSuccess, fnError) {
  try {
    fnSuccess(eval(str))
  } catch (e) {
    fnError(e)
  }
}
