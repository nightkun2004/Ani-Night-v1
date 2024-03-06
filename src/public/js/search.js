document.addEventListener('DOMContentLoaded', function() {
            const searchForm = document.querySelector('#search-form');
        
            searchForm.addEventListener('submit', function(event) {
                event.preventDefault(); 
        
                const queryInput = document.querySelector('input[name="query"]');
                const query = queryInput.value.trim();
        
                if (query !== '') {
                    const searchUrl = `/search?query=${encodeURIComponent(query)}`;
        
                    window.location.href = searchUrl;
                }
            });
        });
        