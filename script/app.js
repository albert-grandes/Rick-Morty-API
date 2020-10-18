/************************************************************************************************
INDEX
  2. Automatic run
  4. Sidebar
    => showSidePanel(urlFromAPAge, type)
    => showList(elementArray, type, anchorID)
  5. Main Section
    => showMainPanel(objectOfOne, type)
  7. Card Maker
    => makeCard (title, subtitle, imgSRC=null)
  8. Panel Reset

************************************************************************************************/
let log = console.log


/************************************************************************************************/
//S> 2. Automatic run
$(document).ready(function () {
  //First load the episode panel with the first page of episodes :)
  $("#episodes").addClass("active")
  showSidePanel('https://rickandmortyapi.com/api/episode')


  $("#episodes").click(function() {
    $(".header__nav").children().removeClass("active")
    $(this).addClass("active")
    resetPanel()
    showSidePanel('https://rickandmortyapi.com/api/episode', 'episode')
  })
  $("#character").click(function() {
    $(".header__nav").children().removeClass("active")
    $(this).addClass("active")
    resetPanel()
    showSidePanel('https://rickandmortyapi.com/api/character', 'character')
  })
  $("#locations").click(function() {
    $(".header__nav").children().removeClass("active")
    $(this).addClass("active")
    resetPanel()
    showSidePanel('https://rickandmortyapi.com/api/location', 'location')
  })
})
//E> 2. Automatic run
/************************************************************************************************/

/************************************************************************************************/
//S> 4. SideBar
function showSidePanel(urlFromAPage, type='episode'){
  axios.get(urlFromAPage)
  .then(function(response) {
    const arrayEpisodes = response.data.results
    const info = response.data.info
    showList(arrayEpisodes, type)
    showNavButtons(info.next, info.prev, type, "paginationList")
  })
}

function showList(elementArray, type, anchorID='episodesList'){
  $(`#${anchorID}`).empty()
  console.log(elementArray)
  elementArray.forEach(element => {
    //S> Data used in every loop
    let text, title
    const epClass = 'main__nav__list__element' //Element class
    switch (type) {
      case 'episode':
        const epNumber = `Episode ${element.id}`  //Episode number
        const epName = `${element.name}`      //Episode name
        const textToShow = element.id + '. ' +element.name // Not in use
        text= epNumber
        title = epName
        break
      case 'character':
        text = `${element.id}. ${element.name}`
        title= `${element.name}`
        break
      case 'location':
        text = `${element.id}. ${element.name}`
        title= `${element.name}`
        break
    }
    //E> Data used in function

    $('<div>', {class: epClass, text: text, title: title})
    .click(function(){
      showMainPanel(element, type)
    })
    .appendTo(`#${anchorID}`)
  });
}

function showNavButtons(next, prev, type, anchorID='paginationList') {
  //This functionmake a button to change page if is posible to and anchorID...
  $(`#${anchorID}`).empty()

  if(prev != null) {
    $('<button>', {text:'prev', id:'prevBtn'}).click(function(){
      showSidePanel(prev, type)
    }).appendTo($(`#${anchorID}`))
  }

  if(next != null) {
    $('<button>', {text:'next', id:'nextBtn'}).click(function(){
      showSidePanel(next, type)
    }).appendTo($(`#${anchorID}`))
  }
}
//E> 4. Sidebar
/************************************************************************************************/

/************************************************************************************************/
//S> 5. Main Section
function showMainPanel(objectOfOne, type='episode') {
  //objecOfOne episode character location
  $('#idSectionBody').empty()
  //S> Data used in function
  //This data depends from the type of object we are goigng to receive
  switch (type) {
    case 'episode':
      //S> Header data
      var title = objectOfOne.name
      var subtitle = objectOfOne.air_date + ' | ' + objectOfOne.episode
      var imgClass = 'hide';
      var imgURL = '';
      //E> Header data

      //S> Body data
      var objectToIterate = objectOfOne.characters
      //E> Body data
      break;
    case 'character':
      //S> Header data
      const image = objectOfOne.image
      const name = objectOfOne.name
      const species = objectOfOne.species
      const status = objectOfOne.status
      const gender = objectOfOne.gender
      const originName = objectOfOne.origin.name
      var title = objectOfOne.name
      var subtitle = species + ' | ' + status + ' | ' + gender + ' | ' + originName
      var imgClass = 'header__image';
      var imgURL = image;
      //E> Header data

      //S> Body data
      var objectToIterate = objectOfOne.episode
      //E> Body data
      break;
    case 'location':
      //S> Header data
      var title = objectOfOne.name
      var subtitle = objectOfOne.type + ' | ' + objectOfOne.dimension
      var imgClass = 'hide';
      var imgURL = '';
      //E> Header data

      //S> Body data
      var objectToIterate = objectOfOne.residents
      //E> Body data
      break;
  }
  //E> Data used in function

  //This function is divided in two parts: header(main__section__header) and body (main__section__body)

  //S> Main Section Header
  //    Is the same for all the type objects
  $('#idSectionHeaderImage').attr('src', imgURL).removeClass().addClass(imgClass)
  $('#idSectionHeaderTitle').text(title)
  $('#idSectionHeaderSubtitle').text(subtitle)


  //S> Main Section Body
  $.each(objectToIterate, function(index, elementURL){
    axios.get(elementURL).then(function(result){

      const objectResult = result.data
      let name, subtitle, image;

      switch (type) {
        case "episode":
          const species = objectResult.species
          const status = objectResult.status
          name = objectResult.name
          subtitle = species + ' || ' + status
          image = objectResult.image
          break
        case 'character':
          name = objectResult.name
          subtitle = objectResult.episode + ' || ' + objectResult.air_date
          image = null
          break
        case 'location':
          const species2 = objectResult.species
          const status2 = objectResult.status
          name = objectResult.name
          subtitle = species2 + ' || ' + status2
          image = objectResult.image
          break
      }
      const div = makeCard(name, subtitle, image)
      $(div).click(function() {
        switch(type) {
          //In that place we have to know the api and know what result can iterate...
          case 'episode':
            showMainPanel(objectResult, 'character')
            break;
          case 'character':
            showMainPanel(objectResult, 'episode')
            break;
          case 'location':
            showMainPanel(objectResult, 'character')
            break;
        }
      })
      $('#idSectionBody').append(div)
    })
  })
}
//S> 5. Main Section
/************************************************************************************************/

/************************************************************************************************/
//S> 7. Card Maker
function makeCard (title, subtitle, imgSRC=null) {
  let div;
  let imgClass
  if(imgSRC == null) {
    imgClass = 'hide'
    div = $('<div>', {class: "label__card"})
  } else {
    imgClass = 'card__image'
    div= $('<div>', {class: "card"})
  }
  $(div)
  .append(
    $('<img>', {src: imgSRC, class: imgClass})
  ).append(
    $('<p>', {class: 'card__title', text: title})
  ).append(
    $('<p>', {class: 'card__subtitle', text: subtitle})
  )
  return div
}
//E> 7. Card Maker
/************************************************************************************************/

/************************************************************************************************/
//S> 8. Panel Reset
function resetPanel() {
  $('#idSectionHeaderImage').removeClass().addClass("hide")
  $('#idSectionHeaderTitle').empty()
  $('#idSectionHeaderSubtitle').empty()
  $('#idSectionBody').empty()
}
//E> 8. Panel Reset
/************************************************************************************************/