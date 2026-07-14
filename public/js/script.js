(() => {
    'use strict'

    const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
        if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
        }

        form.classList.add('was-validated')
    }, false)
    })
})()

const listingSearchInput = document.querySelector("#listing-search");
const listingSuggestions = document.querySelector("#listing-suggestions");

if (listingSearchInput && listingSuggestions) {
    listingSearchInput.addEventListener("input", async () => {
        const searchText = listingSearchInput.value.trim();

        listingSuggestions.innerHTML = "";

        if (!searchText) {
            return;
        }

        const response = await fetch(`/listings/suggestions?q=${encodeURIComponent(searchText)}`);
        const suggestions = await response.json();

        suggestions.forEach((listing) => {
            const option = document.createElement("option");
            option.value = listing.title;
            option.label = [listing.location, listing.country].filter(Boolean).join(", ");
            listingSuggestions.appendChild(option);
        });
    });
}
