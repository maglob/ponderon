var bubbles = {}
var nextBubbleId = 1

window.onload = function () {
  var input = d3.select('textarea#console')
  var output = d3.select('div#output')
  var error = d3.select('div#error')
  var scrapbook = d3.select('div#scrapbook')

  input.style('background-color', '#c0c0c0')
  input.node().focus()
  input.on('keyup', (e = d3.event) => {
    if (e.keyCode == 13) {
      if (!e.shiftKey) {
        process(input.property('value'))
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
            .text(bubbles[id].text)
            .classed('bubble', true)
        e.preventDefault()
      })

  function process(str) {
    execute(str,
        function(result) {
          var bubble = {
            id: nextBubbleId++,
            text: str
          }
          bubbles[bubble.id] = bubble
          output.append("div")
              .text(bubble.text)
              .classed('bubble', true)
              .attr('draggable', 'true')
              .attr('data-id', bubble.id)
              .on('dragstart', (e = d3.event) => {
                e.dataTransfer.setData('text/plain', bubble.id)
                e.dataTransfer.dropEffect = 'copy'
              })
          output.append("div")
              .attr('class', 'bubble output')
              .text(result)
              .node().scrollTop = output.node().getBoundingClientRect().height
          error.style('visibility', 'hidden')
          input.property('value', '')
        },
        function(e) {
          error.style('visibility', 'visible').text(e)
        })
  }
}

function execute(str, fnSuccess, fnError) {
  try {
    fnSuccess(eval(str))
  } catch (e) {
    fnError(e)
  }
}
