var keydownLaunched = false
var width
var height
var nameList = {}
var holder = document.getElementById('holder');
// var showType = 'tableLike'
var showType = 'slideLike'
var visibLev = {}


function sortObjectByKeys(o) {
  return Object.keys(o).sort().reduce((r, k) => (r[k] = o[k], r), {});
}

function setRatio() {
  let ratio = document.querySelector('#ratio').value
  if (!width) {
    width = document.querySelector('img').offsetWidth
  }
  width_new = width * parseFloat(ratio)
  document.querySelectorAll('.img').forEach(i => {
    i.style.width = `${width_new}px`
    i.style.height = `${width_new / 1920 * 1080}px`
    i.style.background = 'black'
  })
}

function setMethod() {
  document.querySelector('#container').innerHTML = ''
  let method = document.querySelector('#method').value
  showType = method
  if (method === 'tableLike') {
    // if (Object.keys(nameList).length > 0) {
    Object.entries(nameList).forEach(i => {
      procHtml_table(i[1])
    })
    // }
  } else if (method === 'slideLike') {
    // if (Object.keys(nameList).length > 0) {
    let event = Object.values(nameList)[0]
    procHtml_slide(event)
    eventListener(nameList)
    let slide = container.querySelector('.slide')
    let visRes = document.querySelector('#vislevel')
    let name = document.querySelector('img')
    if (name) {
      name = name.id
      name = name.substr(0, name.length - 2) + '00'
      let res = visibLev[name]
      res = res ? res : '-'
      if (!visRes) {
        visRes = slide.appendChild(document.createElement("div"))
        visRes.id = 'vislevel'
        visRes.style = 'text-align:center; position: absolute; width: 300px; height: 50px; line-height: 50px; font-size:22px; color: red'
        visRes.appendChild(document.createTextNode(`能見度分級： Class ${res}`))
      } else {
        let res = i.code.replace('Digit', '')
        visibLev[name] = res
        visRes.textContent = `能見度分級： Class ${res}`
      }
    }
    // }
  } else if (method === 'heatmap') {
    if (Object.keys(visibLev).length === 0) {
      alert('請上傳分級檔')
    } else {
      plotHeatmap(visibLev)
    }
  }
}

function saveVisLevel(item) {
  let csv = ''
  Object.keys(visibLev).forEach(i => {
    visibLev[i] = parseInt(visibLev[i])
    csv += [i, visibLev[i]].join(',') + '\r\n'
  })

  var text
  if (item.value === 'json') {
    // text = ''
    text = JSON.stringify(visibLev)
  } else if (item.value === 'txt') {
    text = csv
  }
  var a = document.getElementById("download");
  var file = new Blob([text], { type: 'text/json' });
  // var file = new Blob([JSON.stringify(visibLev)], { type: 'text/json' });
  a.href = URL.createObjectURL(file);
  a.download = `分級結果.${item.value}`;
  document.body.appendChild(a);
  a.click();
  // document.body.removeChild(a);
}

function procHtml_table(event) {
  let container = document.getElementById('container');
  let table = container.querySelector('table')
  let tr
  let th
  let tds
  let time
  let img

  if (!table) {
    table = container.appendChild(document.createElement("table"))
    table.style.width = '100vw'
    tr = table.appendChild(document.createElement("tr"))
    th = tr.appendChild(document.createElement("th"))
    th.textContent = '時間'
    th = tr.appendChild(document.createElement("th"))
    th.textContent = '影像';
    th = tr.appendChild(document.createElement("th"))
    th.textContent = '註記';
  }
  tr = table.appendChild(document.createElement("tr"))
  let ncols = 3;
  for (let i = 0; i < ncols; i++) {
    tr.appendChild(document.createElement("td"))
  }
  tds = tr.querySelectorAll('td')
  time = tds[0].appendChild(document.createTextNode(event.target.fileName))
  img = tds[1].appendChild(document.createElement("img"))
  img.setAttribute('id', event.target.fileName)
  img.setAttribute('alt', "")
  img.setAttribute('class', "img")
  img.setAttribute('style', 'width:100%')
  img.setAttribute('src', event.target.result)
};

function procHtml_slide(event) {
  let container = document.getElementById('container');
  let slide = container.querySelector('.slide')
  let img

  if (!slide) {
    slide = container.appendChild(document.createElement("div"))
    slide.style.width = '100%'
    slide.className = 'slide'

    let text = slide.appendChild(document.createElement("div"))
    text.appendChild(document.createTextNode(event.target.fileName))
    text.setAttribute('style', 'font-size:24px')
    text.setAttribute('class', 'hc time')

    let imgDiv = slide.appendChild(document.createElement("div"))
    imgDiv.style.position = 'absolute'
    imgDiv.style.width = '100%'
    imgDiv.style.height = '100%'
    // let imgDiv2 = imgDiv.appendChild(document.createElement("div"))
    imgDiv.className = 'hc'
    img = imgDiv.appendChild(document.createElement("img"))
    img.setAttribute('id', event.target.fileName)
    img.setAttribute('alt', "")
    img.setAttribute('class', "img")
    img.setAttribute('style', 'width:100%')
    img.setAttribute('src', event.target.result)
    let width = document.querySelector('.slide').offsetWidth
    let height = width / 1920 * 1080;
    slide.style.height = `${height}px`
    slide.style.position = 'relative'
    let control = slide.appendChild(document.createElement("div"))
    control.setAttribute('class', 'control')
    control.style.position = 'absolute'
    control.style.width = '100%'
    control.style.height = '100%'
    let left = control.appendChild(document.createElement("div"))
    let right = control.appendChild(document.createElement("div"))
    left.setAttribute('class', 'changeImage')
    right.setAttribute('class', 'changeImage')
    left.setAttribute('style', 'width:50%; height:100%')
    right.setAttribute('style', 'width:50%; height:100%')
    left.id = 'left'
    right.id = 'right'

  } else {
    img = slide.querySelector('img')
    img.src = event.target.result
    img.id = event.target.fileName
    let text = document.querySelector('.time')
    text.textContent = event.target.fileName
  }
}

function procName(name) {
  let tmp = name.replace('.jpg', '').split('-').slice(1).join(' ')
  let fileName =
    `${tmp.slice(0, 4)}-${tmp.slice(4, 6)}-${tmp.slice(6, 8)} ${tmp.slice(9, 11)}:00`
  // let fileName =
  //   `${tmp.slice(0, 4)}-${tmp.slice(4, 6)}-${tmp.slice(6, 8)} ${tmp.slice(9, 11)}:${tmp.slice(11, 13)}`
  return fileName
}

async function readFile(files) {
  return new Promise((resolve, reject) => {
    var fileList = {}
    files.forEach((fs, ind) => {
      let name = procName(fs.name)
      var reader = new FileReader();
      reader.fileName = name
      reader.onload = function (event) {
        fileList[name] = event
        if (showType === 'tableLike') {
          procHtml_table(event)
        } else if (showType === 'slideLike') {
          if (ind === 0) { procHtml_slide(event) }
        }
      }
      reader.readAsDataURL(fs);
    })
    fileList = Object.entries(fileList)
    resolve(fileList)
  })
};

function checkFormat(files) {
  let images = []
  let text = []
  let subName
  files.forEach(i => {
    subName = i.name.split('.').slice(-1)[0]
    if (!['jpg', 'jpeg', 'png', 'csv', 'json'].includes(subName)) {
      alert('輸入檔案格式不支援。請確認格式為影像（jpg、jpeg、png），或是文字檔（json、csv）');
      return false
    } else {
      if (['jpg', 'jpeg', 'png'].includes(subName)) {
        images.push(i)
      } else if (['csv', 'json'].includes(subName)) {
        text.push(i)
      }

    }

  })
  return [images, text]
}

function eventListener(nameList) {
  // next
  document.querySelector('#right').addEventListener('click', () => {
    let currImg = document.querySelector('div img').id
    let allName = Object.keys(nameList)
    let ind = allName.indexOf(currImg) + 1
    let event = nameList[allName[ind]]
    procHtml_slide(event)
    let visRes = document.querySelector('#vislevel')
    if (visRes) {
      let name = event.target.fileName
      name = name.substr(0, name.length - 2) + '00'
      let res = visibLev[name]
      visRes.textContent = `能見度分級： Class ${res === undefined ? "-" : res}`
    }
  })
  // previous
  document.querySelector('#left').addEventListener('click', () => {
    let currImg = document.querySelector('div img').id
    let allName = Object.keys(nameList)
    let ind = allName.indexOf(currImg) - 1
    let event = nameList[allName[ind]]
    procHtml_slide(event)
    let visRes = document.querySelector('#vislevel')
    if (visRes) {
      let name = event.target.fileName
      name = name.substr(0, name.length - 2) + '00'
      let res = visibLev[name]
      visRes.textContent = `能見度分級： Class ${res === undefined ? "-" : res}`
    }
    // if (visRes) { visRes.remove() }
  });


  if (!keydownLaunched) {
    window.addEventListener('keydown', i => {
      // q = i
      if (showType === 'slideLike') {
        let event = Object.values(nameList)[0]
        if (i.code === 'ArrowRight' | i.code === 'Space') {
          let currImg = document.querySelector('div img').id
          let allName = Object.keys(nameList)
          let ind = allName.indexOf(currImg) + 1
          event = nameList[allName[ind]]
          procHtml_slide(event)
          let visRes = document.querySelector('#vislevel')
          if (visRes) {
            let name = event.target.fileName
            name = name.substr(0, name.length - 2) + '00'
            let res = visibLev[name]
            visRes.textContent = `能見度分級： Class ${res === undefined ? "-" : res}`
          }

        } else if (i.code === 'ArrowLeft') {
          let currImg = document.querySelector('div img').id
          let allName = Object.keys(nameList)
          let ind = allName.indexOf(currImg) - 1
          event = nameList[allName[ind]]
          procHtml_slide(event)
          let visRes = document.querySelector('#vislevel')
          if (visRes) {
            let name = event.target.fileName
            name = name.substr(0, name.length - 2) + '00'
            let res = visibLev[name]
            visRes.textContent = `能見度分級： Class ${res === undefined ? "-" : res}`
          }

        } else if (['Digit1', 'Digit2', 'Digit3', 'Digit4'].includes(i.code)) {
          let name = document.querySelector('div img').id
          let res = i.code.replace('Digit', '')
          visibLev[name] = res
          let slide = document.querySelector('.slide')
          let visRes = document.querySelector('#vislevel')
          if (!visRes) {
            visRes = slide.appendChild(document.createElement("div"))
            visRes.id = 'vislevel'
            visRes.style = 'text-align:center; position: absolute; width: 300px; height: 50px; line-height: 50px; font-size:22px; color: red'
            visRes.appendChild(document.createTextNode(`能見度分級： Class ${res}`))
          } else {
            let res = i.code.replace('Digit', '')
            visibLev[name] = res
            visRes.textContent = `能見度分級： Class ${res}`
          }

        }
      }
    })
    keydownLaunched = true
  }
}

holder.ondragover = function () {
  this.className = 'hover';
  return false;
};

holder.ondrop = async function (e) {
  e.preventDefault();
  var files = Object.values(e.dataTransfer.files)
  let res = checkFormat(files)

  if (!res) {
    // 如果輸入檔案不符合格式
    console.log('nothing to do')

  } else {
    // 格式正確
    let [images, text] = res

    // 處理影像
    if (images.length > 0) {
      nameList = await readFile(images)
      setTimeout(() => {
        nameList = sortObjectByKeys(nameList);
        if (showType === 'slideLike') {
          eventListener(nameList)
        }
      }, 100)
    };

    // 處理文字
    if (text.length > 0) {
      console.log('got txt file')
      if (text.length > 1) {
        alert('找到不只一筆分級數據，請選定一筆數據。')
      } else {
        visibLev = await readText(text[0])
        setTimeout(() => {
          let slide = document.querySelector('.slide')
          let name = document.querySelector('img')
          if (name) {
            name = name.id
            name = name.substr(0, name.length - 2) + '00'
            let res = visibLev[name]
            res = res ? res : '-'
            let visRes = document.querySelector('#vislevel')
            if (!visRes) {

              visRes = slide.appendChild(document.createElement("div"))
              visRes.id = 'vislevel'
              visRes.style = 'text-align:center; position: absolute; width: 300px; height: 50px; line-height: 50px; font-size:22px; color: red'
              visRes.appendChild(document.createTextNode(`能見度分級： Class ${res}`))
            } else {
              // let res = i.code.replace('Digit', '')
              // visibLev[name] = res
              visRes.textContent = `能見度分級： Class ${res}`
            }
          } else {
            document.querySelector('#method [value="heatmap"]').selected = 'selected'
            showType = 'heatmap'
            plotHeatmap(visibLev)
          }
          // }
        }, 100)
      }
    }
  }
};

function range(min = 0, max = null) {
  if (max === null) {
    max = min;
    min = 0;
  }
  var rg = [...Array(max).keys()];
  return rg.slice(min, max);
}

function transform(array) {
  return array[0].map((_, colIndex) => array.map(row => row[colIndex]));
}

function plotHeatmap(visibLev) {
  let container = document.querySelector('#container')
  let div = container.appendChild(document.createElement('div'))
  div.id = 'myDiv'
  visibLev2 = {}
  timeList = []
  dayList = []
  Object.keys(visibLev).forEach(i => {
    let [day, time] = i.split(' ')
    if (!dayList.includes(day)) {
      dayList.push(day)
    }
    if (!timeList.includes(time)) {
      timeList.push(time)
    }
    range(6, 19).forEach(j => {
      if (!visibLev2[j]) {
        visibLev2[j] = []
      }
      let time = ' ' + `${j}`.padStart(2, 0)
      if (i.includes(time)) {
        visibLev2[j].push(visibLev[i])
      }
    })
  })
  visibLev2 = Object.values(visibLev2)
  visibLev2 = transform(visibLev2)

  var xValues = timeList;

  var yValues = dayList;
  // var yValues = dayList.reverse();

  var zValues = visibLev2;

  var colorscaleValue = [
    // [0, 'rgba(200, 200,200, .8)'],
    // [1, 'rgba(75, 14, 14, 0.831)'],
    // [2, 'rgba(118, 47, 47, 0.831)'],
    // [3, 'rgba(172, 138, 169, 0.831)'],
    // [4, 'rgba(190, 208, 220, 0.831)'],
    ['0', 'rgb(200, 200,200)'],
    ['.25', 'rgb(165,0,38)'],
    // ['1', 'rgb(215,48,39)'],
    ['.5', 'rgb(244,109,67)'],
    ['.75', 'rgb(253,174,97)'],
    ['1', 'rgb(254,224,144)'],
    // ['1', 'rgb(224,243,248)'],
    // ['6', 'rgb(171,217,233)'],
    // ['7', 'rgb(116,173,209)'],
    // ['1', 'rgb(69,117,180)'],
  ];

  var data = [{
    x: xValues,
    y: yValues,
    z: zValues,
    type: 'heatmap',
    colorscale: colorscaleValue,
    showscale: false,
    xgap: 5,
    ygap: 5,
  }];

  var layout = {
    title: '能見度熱圖',
    annotations: [''],
    xaxis: {
      ticks: '',
      side: 'top',
      color: 'black'
      // showgrid: true,
      // gridcolor: 'black'
    },
    yaxis: {
      ticks: '',
      ticksuffix: ' ',
      // width: 700,
      // height: 700,
      autosize: false,
      autorange: 'reversed',
      // showgrid: true,
      color: 'black',
      tickmode: "linear",
      tick0: dayList[0],
      // dtick: 60 * 60 * 24
    }
  };

  // for (var i = 0; i < yValues.length; i++) {
  //   for (var j = 0; j < xValues.length; j++) {
  //     var currentValue = zValues[i][j];
  //     if (currentValue != 0.0) {
  //       var textColor = 'white';
  //     } else {
  //       var textColor = 'black';
  //     }
  //     var result = {
  //       xref: 'x1',
  //       yref: 'y1',
  //       x: xValues[j],
  //       y: yValues[i],
  //       text: zValues[i][j],
  //       font: {
  //         family: 'Arial',
  //         size: 12,
  //         color: 'rgb(50, 171, 96)'
  //       },
  //       showarrow: false,
  //       font: {
  //         color: textColor
  //       }
  //     };
  //     layout.annotations.push(result);
  //   }
  // }
  config = { responsive: true }
  Plotly.newPlot('myDiv', data, layout, config);

  div.on('plotly_hover', function (data) {


    let time = `${data.points[0].y} ${data.points[0].x}`
    // console.log(data, time)
    if (Object.keys(nameList).length > 0) {
      let img = nameList[time].target.result
      let container = document.querySelector('#container')
      let box = document.querySelector('#box')
      if (box) {
        box.remove()
      }
      box = container.appendChild(document.createElement('div'))
      box.id = 'box'
      box.style = `border-radius:10px; width: 240px; height: 160px; border: 2px black solid; position: absolute; left:${data.event.layerX - 120}px; top:${data.event.layerY + 40}px`
      imgBox = box.appendChild(document.createElement('img'))
      imgBox.style = 'width:100%; height:100%;border-radius:10px;'
      imgBox.src = img
      // console.log(data)

      // console.log(img)
    }
    //   var pts = '';
    //   for (var i = 0; i < data.points.length; i++) {
    //     annotate_text = 'x = ' + data.points[i].x +
    //       'y = ' + data.points[i].y.toPrecision(4);

    //     annotation = {
    //       text: annotate_text,
    //       x: data.points[i].x,
    //       y: parseFloat(data.points[i].y.toPrecision(4))
    //     }

    // annotations = self.layout.annotations || [];
    //     annotations.push(annotation);
    //     Plotly.relayout('myDiv', { annotations: annotations })
    //   }
  });

}

async function readText(text) {
  return new Promise((resolve, reject) => {
    visibLev = {}
    var reader = new FileReader();
    reader.onload = function (event) {
      let content = event.target.result
      content.split('\n').forEach(i => {
        let [key, value] = i.split(',')
        if (value) {
          visibLev[key] = value
        }
      })

    }
    reader.readAsText(text)
    resolve(visibLev)
  })

}