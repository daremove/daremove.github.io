$(function() {
   
    function checkResult() {
        if (window.location.href.match(/\?(\-?\d*\b)/)) {
            var scores = window.location.href.match(/\?(\-?\d*\b)/)[1];
            var result = $('#result');
            var text = result.text();
            
            result.text(text + scores);
        }
    }

    function getCoord() {
        $(".card").each(function() {
            var posX = $(this).position().left;
            var posY = $(this).position().top;

            var pair = [];
            pair.push(posX);
            pair.push(posY);

            coord.push(pair);
        });
    }
    
    function sequentialEffects(elems, index) {
        index = index || 0;
        
        if(!elems[index]) {
            return setTimeout(function() {
                showCards();
            }, 1000);
        };
        
        $(elems[index]).css("position", "absolute");
        $(elems[index]).css("left", "0px");
        $(elems[index]).css("top", "0px");
        
        $(elems[index]).animate({
            opacity: 1,
            left: coord[index][0] + "px",
            top: coord[index][1] + "px"
        }, "fast", function() {
            sequentialEffects(elems, index + 1);
        });
     }
    
    function randomInteger(min, max) {
        var rand = min - 0.5 + Math.random() * (max - min + 1)
        rand = Math.round(rand);
        return rand;
    }
    
    function randomCountNumber(count) {
        count = count || 9;
        var result = [];
        
        for (var i = 1; i <= count; i++) {
            var number = randomInteger(1, 52);
            
            if (result.indexOf(number) == -1) {
                result.push(number);
                result.push(number);
            }
            else {
                i--;
            }
        }
        
        return result.sort(function() {
            return Math.random() - 0.5;
        });
    }
    
    function checkEqualCards() {
        var openCards = $('.card.rotate');
        
        if (openCards.length == 2) {
            if (openCards[0].classList[1] == openCards[1].classList[1]) {
                countOfUnopenPairs--;
                countOfOpenPairs++;
                scores += countOfUnopenPairs * 42;
                
                setTimeout(function() {
                    $(openCards).fadeOut("fast", function() {
                        $(openCards).removeClass('rotate');
                        scoring.text(scores);
                        checkEnd();
                    });
                }, 800);
            } else {
                scores-=countOfOpenPairs*42;
                
                setTimeout(function() {
                    $(openCards).removeClass('rotate');
                    $(openCards).attr('data-tid', 'Card');
                    scoring.text(scores);
                }, 800);
            }
        }
    }
    
    function checkEnd() {
        if (countOfOpenPairs == 9) {
            resulting();
        }
    }
    
    function resulting() {
        window.location.href = 'end.html?' + scores;
    }
        
    function generateCards() {
        var randomCards = randomCountNumber();
        
        $.each(cards, function(i, elem) {
            $(elem).addClass('card-' + classes[randomCards[i]-1]);
            $(elem).attr('data-tid', 'Card');
        });
        
    }
    
    function addClick() {
        var numberOfOpenCards = 0;
        
        $(cards).click(function() {
            if(numberOfOpenCards == 2) {
                numberOfOpenCards = 0;
                checkEqualCards();
            } else {
                $(this).addClass('rotate');
                $(this).attr('data-tid', 'Card-flipped');
                numberOfOpenCards++;
                if (numberOfOpenCards == 2) {
                    numberOfOpenCards = 0;
                }
                checkEqualCards();
            }
        });
    }
    
    function closeCards() {
        $(cards).removeClass('rotate');
        $(cards).attr('data-tid', 'Card');
        addClick();
    }
    
    function showCards(interval) {
        interval = interval*1000 || 5000;
        
        $(cards).addClass('rotate');
        $(cards).attr('data-tid', 'Card-flipped');
        
        setTimeout(function() {
            closeCards();
        }, interval);
    }
    
    function startGame() {
        checkResult();
        getCoord();
        generateCards();
        sequentialEffects(cards);
    }
    
    function clearAllEffects() {
        scores = 0;
        countOfOpenPairs = 0;
        countOfUnopenPairs = 9;
        
        scoring.text(scores);
        $(cards).off('click');
        $(cards).stop(true);
        $(cards).css('opacity', '0').css('display', 'block');
        $(cards).removeClass().addClass('card');
    }
    
    var restart = $('#restart'),
        cards = $(".card"),
        scoring = $('.points__count');

    var coord = [];
    
    var classes = ['0C', '0D', '0H', '0S', '2C', '2D', '2H', '2S', '3C', '3D', '3H', '3S', '4C', '4D', '4H', '4S', '5C', '5D', '5H', '5S', '6C', '6D', '6H', '6S', '7C', '7D', '7H', '7S', '8C', '8D', '8H', '8S', '9C', '9D', '9H', '9S', 'AC', 'AD', 'AH', 'AS', 'JC', 'JD', 'JH', 'JS', 'KC', 'KD', 'KH', 'KS', 'QC', 'QD', 'QH', 'QS'];

    var scores = 0,
        countOfOpenPairs = 0,
        countOfUnopenPairs = 9;
    
    restart.click(function(e) {
        e.preventDefault();
        
        clearAllEffects();
        startGame();
    });
    
    startGame();
    
});