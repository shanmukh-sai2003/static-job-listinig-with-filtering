let jsonF;
fetch('./data.json')
.then((Response) => Response.json())
.then((json) => {
    jsonF = json;
    fillJobLists();
});

function fillJobLists() {
    for(let ele = 0; ele < jsonF.length; ele++) {
        let jobElement = document.querySelector(`#${jsonF[ele].id}`);
        jobElement.innerHTML = `
        <table>
        <tr>
          <td>
            <div class="company">
              <img src="${jsonF[ele].logo}" alt="">
            </div>
          </td>
          <td>
            <div class="description">
              <h3>${jsonF[ele].company}</h3>
              <div class="extraTags"></div>
              <h2>${jsonF[ele].position}</h2>
              <span>${jsonF[ele].postedAt}</span>
              <span>.</span>
              <span>${jsonF[ele].contract}</span>
              <span>.</span>
              <span>${jsonF[ele].location}</span>
            </div>
          </td>
            <div class="tags">
              <span class="tablet">${jsonF[ele].role}</span>
              <span class="tablet">${jsonF[ele].level}</span>
            </div>
        </tr>
      </table>`;

      const tag = document.querySelector(`#${jsonF[ele].id} .tags`);
      for(let i of jsonF[ele].languages) {
        const tablet = document.createElement('span');
        tablet.className = "tablet";
        tablet.innerText = i;
        tag.appendChild(tablet);
      }

      for(let i of jsonF[ele].tools) {
        const tablet = document.createElement('span');
        tablet.className = "tablet";
        tablet.innerText = i;
        tag.appendChild(tablet);
      }

      const extraTags = document.querySelector(`#${jsonF[ele].id} .extraTags`);
      if(jsonF[ele].new) {
        const newTag = document.createElement("span");
        newTag.className = 'new';
        newTag.innerText = "NEW!";
        extraTags.appendChild(newTag);
      } 
      
      if(jsonF[ele].featured) {
        const featuredTag = document.createElement("span");
        featuredTag.className = 'featured';
        featuredTag.innerText = "FEATURED";
        extraTags.appendChild(featuredTag);
      }
    }

    let filteredElements = jsonF;
    let temElements = filteredElements;
    let tagsSelected = [];
    const tablets = document.querySelectorAll(".tags .tablet");
    const selectedTags = document.querySelector(".selectedTags");

    for(let tablet of tablets) {
        tablet.addEventListener("click", (e) => {
          selectedTags.style.display = "block";
          const tag = document.createElement("div");
          tag.className = "tag";
          tag.id = e.target.innerText;
          tag.innerHTML = `<span>${e.target.innerText}</span><span class="close">X</span>`;
          selectedTags.appendChild(tag);

          let text = e.target.innerText;
          tagsSelected.push(text);

          const close = document.querySelector(`#${text} .close`);
          close.addEventListener('click', (e) => {
            tagsSelected = tagsSelected.filter((s) => s != text);
            if(tagsSelected.length == 0) {
              filteredElements = clearAll();
            } else {
              filteredElements = colseTag(text, tagsSelected);
            }
          });

          temElements = filteredElements.filter(ele => (ele.role === text || ele.level === text || ele.languages.includes(text) || ele.tools.includes(text)));
          filteredElements = filteredElements.filter(ele => !(ele.role === text || ele.level === text || ele.languages.includes(text) || ele.tools.includes(text)));
          for(let i of filteredElements) {
            const tem = document.getElementById(i.id);
            tem.style.display = "none";
          }
          filteredElements = temElements;
        });
    }

    const clear = document.querySelector(".selectedTags a");
    clear.addEventListener("click", () => {
      filteredElements = clearAll();
    });
}

function colseTag(text, tagsSelected) {
  const tag = document.getElementById(text);
  tag.remove();
  let reFilteredElements = jsonF;
  let tem = jsonF;

  for(let text of tagsSelected) {
    reFilteredElements = reFilteredElements.filter((ele) => (ele.role === text || ele.level === text || ele.languages.includes(text) || ele.tools.includes(text)));
  }

  tem = jsonF.filter((ele) => !reFilteredElements.includes(ele));
  for(let i of jsonF) {
    const job = document.getElementById(i.id);
    job.style.display = "block";
  }

  for(let ele of tem) {
    const job = document.getElementById(ele.id);
    job.style.display = "none";
  }
  return reFilteredElements;
}

function clearAll() {
  const selectedTags = document.querySelector(".selectedTags");
  const tags = document.querySelectorAll(".selectedTags .tag");
  for(let i of tags) {
    i.remove();
  }
  selectedTags.style.display = "none";
  for(let i of jsonF) {
    const job = document.getElementById(i.id);
    job.style.display = "block";
  }
  return jsonF;
}
