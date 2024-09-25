document.getElementById('geolocationForm').addEventListener('submit', async function (e) {
    e.preventDefault(); 

    const feature = document.querySelector('input[name="feature"]:checked').value;
    const inputField = document.getElementById('inputField');
    const inputValue = inputField.value.trim();

    let apiUrl;

    // Determine the API URL based on the selected feature
    if (feature === 'geocode') {
        apiUrl = `/geocode?address=${encodeURIComponent(inputValue)}`;
    } else if (feature === 'reverse-geocode') {
        const coordinates = inputValue.split(','); 
        if (coordinates.length !== 2) {
            document.getElementById('result').textContent = 'Please enter coordinates in the format "latitude,longitude".';
            return; 
        }
        const [lat, lng] = coordinates.map(coord => coord.trim()); 
        apiUrl = `/reverse-geocode?lat=${lat}&lng=${lng}`;
    } else if (feature === 'geolocation') {
        apiUrl = `/geolocation?ip=${encodeURIComponent(inputValue)}`;
    }

    try {
        const response = await fetch(apiUrl);
        
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();
        
        
        document.getElementById('result').textContent = JSON.stringify(result, null, 2);
    } catch (error) {
        document.getElementById('result').textContent = `Error fetching data: ${error.message}`;
    }
});

const radioButtons = document.querySelectorAll('input[name="feature"]');
radioButtons.forEach((radio) => {
    radio.addEventListener('change', () => {
        document.getElementById('inputField').value = ''; 
    });
});
