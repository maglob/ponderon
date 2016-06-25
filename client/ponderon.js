var bubbles = {}
var nextBubbleId = 1

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

  return process

  function process(str) {
    execute(str,
        function (result) {
          var bubble = createBubble(str)
          output.append("div")
              .text(bubble.text)
              .classed('bubble', true)
              .attr('draggable', 'true')
              .attr('data-id', bubble.id)
              .on('dragstart', (e = d3.event) => {
                e.dataTransfer.setData('text/plain', bubble.id)
                e.dataTransfer.dropEffect = 'copy'
              })
          if (result != undefined) {
            output.append("div")
                .attr('class', 'bubble output')
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

function createBubble(str) {
  var bubble = {
    id: nextBubbleId++,
    text: str
  }
  bubbles[bubble.id] = bubble
  return bubble
}

function execute(str, fnSuccess, fnError) {
  try {
    fnSuccess(eval(str))
  } catch (e) {
    fnError(e)
  }
}
