class PWAData {
    // getting pwa data from pwainfo.jsom using fetch
    async getData() {
        let response = await fetch('../db/pwainfo.json');
        let data = await response.json();
        return data;
    }
};

class UI {
    // populating about section
    populateAbout(about) {
        let output = '';
        about.forEach(data => {
            let threePillarList = '';
            data.subcategory.forEach(subData => {
                threePillarList += `
                    <li><i class="lni lni-target"></i>${subData}</li>
                `;
            })
            output = `
                <p>${data.intro}</p>
                <p>${data.intro2}</p>
                <p>${data.intro3}</p>
                <p>${data.intro4}</p>
                <h4>${data.headsub}</h4>
                <p>${data.headsubintro}</p>
                <ul class="three-pillars">
                    ${threePillarList}
                </ul>
                <div class="conclusion">
                    <h4>${data.conclusion[0].title}</h4>
                    <p>${data.conclusion[0].content}</p>
                    <p class="important">${data.conclusion[0].important}</p>
                </div>
            `;
        })
        // to prevent error caused because of the non-availability of .pwa
        if(document.querySelector('.pwa')) {
            document.querySelector('.pwa').innerHTML = output;
        }
    }
    // populating faqs section
    populateFAQ(faq) {
        let output = '';
        faq.forEach(data => {
            let faqAnswer = '';
            data.a.forEach(ans => {
                faqAnswer += `
                    <li>
                        <p>
                            <i class="lni lni-target"></i>${ans}
                        </p>
                    </li>
                `;
            });
            output += `
                <ul class="faq-list">
                    <li class="faq-item">
                        <p class="faq-q">
                            <span>${data.q} ?</span>
                            <i class="lni lni-chevron-down"></i>
                        </p>
                        <ul class="faq-a">
                            ${faqAnswer}
                        </ul>
                    </li>
                </ul>
            `;
        })
        if(document.querySelector('.faq-content')) {
            document.querySelector('.faq-content').innerHTML = output;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    const pwa = new PWAData();
    const ui = new UI();

    pwa.getData()
        .then(res => {
            const aboutData = res.about;
            const faqData = res.faq;

            ui.populateAbout(aboutData);
            ui.populateFAQ(faqData);
        })  
        .then(() => {
            let faqQuestions = [...document.querySelectorAll('.faq-q')]
            faqQuestions.forEach(faqQuestion => {
                faqQuestion.addEventListener('click', (e) => {
                    e.target.parentElement.classList.toggle('expand-a');
                })
            })
        })
        .catch(err => {
            console.log(err)
        })      
})