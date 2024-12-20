$(document).ready(function() {
    $('#stockForm').on('submit', function(e) {
        e.preventDefault();

        var formData = new FormData(this);
        
        $.ajax({
            url: 'insert_stock.php',
            type: 'POST',
            data: formData,
            contentType: false,
            processData: false,
            success: function(response) {
                if (response === 'success') {
                    alert('Product added successfully!');
                    $('#stockForm')[0].reset();
                } else {
                    alert('Failed to add product.');
                }
            },
            error: function() {
                alert('Error occurred while submitting data.');
            }
        });
    });
});
