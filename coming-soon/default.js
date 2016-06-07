$(document).ready(function () {
    $("#slideshow > div:gt(0)").hide();

    setInterval(function () {
        $('#slideshow > div:first')
            .fadeOut(1000)
            .next()
            .fadeIn(1000)
            .end()
            .appendTo('#slideshow');
    }, 6000);


    $(".element").typed({
        strings: [
            "Opening Match of the IPL Season.",
            "The smell of rain after a hot summer.",
            "A place where awesomeness is worth waiting for.",
            "Because there's no place like ^1500 home.",
            "The best designs in town. ^2000 Get in touch."
        ],
        typeSpeed: 0,
        backSpeed: 0,

        backDelay: 3400,
        callback: function () {
            $(".fader").delay(2000).fadeIn(2000);
            $(".comingSoon").delay(2000).fadeIn(2000);
            $(".element").delay(1000).html("The best designs in town. Get in touch.");
            $(".typeMe").delay(2000).animate({"background": 'rgba(0,0,0,0)'}, 1000);
            $(".logoBox").delay(2000).animate({"background": 'rgba(0,0,0,0)'}, 1000);
        }

    });

    $('.contact').click(function () {
        window.location = '/index.html';

    });

    $('.closeMe').click(function () {
        $('.contactForm').fadeOut(1000);
    })

    $(".formSubmit").click(function () {
        var name = document.getElementById("name").value;
        var email = document.getElementById("email").value;
        var phone = document.getElementById("phone").value;

       var dataString = 'name=' + name + '&email=' + email + '&phone=' + phone;
        if (name == '' || email == '' || phone == '') {
            alert("Please fill all the details!");
        } else {
             $.ajax({
                type: "GET",
                url: "send.php",
                data: dataString,
                success: function (html) {
                    $('#contactUs').fadeOut(500);
                    $('#returnName').text(name);
                    $('.answerSuccess').delay(500).fadeIn(500);
                    $('.contactForm').delay(4000).fadeOut(500);
                }
            });
        }
        return false;
    });

});


function btnClick() {
    if (!validData())
        return false;
}
