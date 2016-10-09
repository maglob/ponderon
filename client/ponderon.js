var rows = []
var maxRowId = 0

window.onload = () => initialize(d3.select('div#notebook'))

function initialize(notebookContainer) {
  addRow('Math.atan(1) *\n 4')
  addRow('100 + 200')
  renderNotebook(notebookContainer, rows)
}

function renderNotebook(container, rows) {
  var r = container.selectAll('div.row').data(rows)
    .enter()
    .append('div')
    .classed('row', true)
    .attr('data-id', d => d.id)

  r.append('textarea')
    .classed('input', true)
    .on('keyup', () => {
      var e = d3.select(d3.event.target)
      if (d3.event.ctrlKey && d3.event.keyCode == 13) {
        evalRow(e)
        var newRow
        if (rows[rows.length - 1].result) {
          newRow = addRow('')
        }
        renderNotebook(container, rows)
        if (newRow) {
          d3.select('div.row[data-id="' + newRow.id + '"] > textarea.input').node().focus()
        }
      }
      e.attr("rows", (e.property("value").match(/\n/g) || []).length + 1)
    })
    .attr("rows", d => (d.text.match(/\n/g) || []).length + 1)

  r.append('div').classed('output', true)

  container.data(rows).selectAll('textarea.input').property("value", d => d.text)
  container.data(rows).selectAll('div.output').text(d => d.result)
}

function evalRow(sel) {
  var row = rows[d3.select(sel.node().parentNode).attr("data-id")]
  row.text = sel.property("value")
  var res = execute(row.text)
  row.result = typeof res == 'function' ? 'function: ' + res : res
}

function addRow(str) {
  var row = {
    id: maxRowId++,
    text: str,
    result: execute(str)
  }
  rows.push(row)
  return row
}

function execute(str) {
  try {
    return eval(str)
  } catch (e) {
    return null
  }
}
