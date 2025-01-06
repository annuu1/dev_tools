async function updateClientDetails(dataURL){
    try {
        const response = await fetch(dataURL);
        const data = await response.json();
        if (data.success) {
            alert("Client details submitted successfully!");
            await loadAndUpdateData()
            window.location.reload()
        } else {
            alert("Failed to submit client details.");
        }
    } catch (error) {
        console.error("Error submitting data:", error);
          alert("An error occurred while submitting the form.");
    }
}