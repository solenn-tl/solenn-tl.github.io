/*
This script is used to load resources from resources.json and display 
them in the relevant section of the Resources area of the html page.
The html section looks like this

    <section class="p-3 p-lg-5 d-flex align-items-center" id="resources">
      <div class="w-100">
        <h2 class="mb-5">Resources</h2>
          <!--Ontologies-->
          <span id="ontologies"><div class="subheading mb-3 mt-3 lang-en">Ontologies</div><div class="subheading mb-3 mt-3 lang-fr">Ontologies</div></span>
          <!--Datasets and deep learning models (Zenodo)-->
          <span id="datasets"><div class="subheading mb-3 mt-3 lang-en">Datasets</div><div class="subheading mb-3 mt-3 lang-fr">Jeux de données</div></span>
          <!-- Codes and sofwares -->
          <span id="softwares"><div class="subheading mb-3 mt-3 lang-en">Codes and softwares</div><div class="subheading mb-3 mt-3 lang-fr">Codes et logiciels</div></span>
          <!-- Models (Zenodo)-->
          <span id="models"><div class="subheading mb-3 mt-3 lang-en">Models</div><div class="subheading mb-3 mt-3 lang-fr">Modèles / réseaux de neurones entraînés</div></span>
          <!--Metadata files (Nakala)-->
          <span id="metadata"><div class="subheading mb-3 mt-3 lang-en">Metadata files</div><div class="subheading mb-3 mt-3 lang-fr">Métadonnées</div></span>
      </div>
    </section>

*/

/**
 * Renders an array of link data as an un-ordered list inside a parent container.
 * 
 * @param {HTMLElement|string} target - Parent DOM element or its string ID.
 * @param {Array<Object>} items - Array of data objects.
 * @param {Function} formatText - Function that takes an item and returns the link text.
 * @param {string} [urlKey='url'] - The property name containing the link URL.
 */
function renderLinkList(target, items, formatText, urlKey = 'url') {
    const container = typeof target === 'string' 
        ? document.getElementById(target) 
        : target;

    if (!container || !Array.isArray(items)) return;

    const listElement = document.createElement('ul');

    // If items is empty, display a message indicating no resources are available
    if (items.length === 0) {
        const noResourcesMessage = document.createElement('p');
        noResourcesMessage.classList.add('lang-en');
        noResourcesMessage.textContent = 'No resources available.';
        container.appendChild(noResourcesMessage);
        const noResourcesMessageFr = document.createElement('p');
        noResourcesMessageFr.classList.add('lang-fr');
        noResourcesMessageFr.textContent = 'Aucune ressource disponible.';
        container.appendChild(noResourcesMessageFr);
        return;
    }

    items.forEach(item => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');

        link.href = item[urlKey] || '#';
        link.textContent = item.name;
        link.target = '_blank';
        link.rel = 'noopener noreferrer'; // Recommended security best practice for target="_blank"

        const additionalText = document.createTextNode(', ' + item.lastversionid + ' (' + item.lastversiondate + ')');
        if (item.doi) {
            additionalText.textContent += ', ' + item.doi;
        } else if (item.url) {
            additionalText.textContent += ', ' + item.url;
        }

        // Append the link first, then append the plain text node next to it
        listItem.appendChild(link);
        listItem.appendChild(additionalText);

        listElement.appendChild(listItem);
    });

    container.appendChild(listElement);
}

// Load the resources from the JSON file and dispatch the items using their type (ontoloy for ontologies div etc).
fetch('./resources.json')
  .then(response => response.json())
    .then(data => {
        //Filter
        data.ontologies = data.filter(item => item.type === 'ontology');
        data.datasets = data.filter(item => item.type === 'dataset');
        data.softwares = data.filter(item => item.type === 'software');
        data.models = data.filter(item => item.type === 'model');
        data.metadata = data.filter(item => item.type === 'metadata');

        // Ontologies population
        renderLinkList(
            'ontologies', 
            data.ontologies
        );

        // Datasets population
        renderLinkList(
            'datasets', 
            data.datasets
        );

        // Softwares population
        renderLinkList(
            'softwares', 
            data.softwares
        );

        // Models population
        renderLinkList(
            'models', 
            data.models
        );
        
        // Metadata population
        renderLinkList(
            'metadata', 
            data.metadata
        );
    })
    .catch(error => console.error('Error loading resources:', error));




    