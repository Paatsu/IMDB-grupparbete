module.exports = {
  $: async function (selector) {
    let elements = await driver.findElements(by.css(selector));
    if (elements.length === 0) {
      return null;
    }
    if (elements.length === 1) {
      return elements[0];
    }
    return elements;
  },
  sleep: function (ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

}
global.selectOption = async (cssSelector, optionName) => {
  let codeToRun = `(()=>{
      let select = document.querySelector('cssSelector');
      if(!select){return;}
      let options = select.querySelectorAll('option');
      options.forEach((option,i) => {
        option.innerText.trim() === 'optionName' && (select.selectedIndex = i);
      })
    })()`
    .split('cssSelector').join(cssSelector)
    .split('optionName').join(optionName);
  await driver.executeScript(codeToRun);
}



