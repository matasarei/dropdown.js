# dropdown.js
Dropdown menu

Requires: jQuery.

## Usage example

### JS
```js
/**
 * @param string selector Dropdown menu selector
 * @param string controls Controls container selector
 * @param obj params Additional params
 */
var dropDown = new DropdownMenu('#dropdown_main', 'menu', {
        debug: true, //keep menu opened
        animation: 250, //0 to disable animations
        timeout: 1500, //autoclose
        onOpen: function(e) { //before open
            console.log(e);
        },
        onClose: function(e) { //before close
            console.log(e);
        }
    });
```

### HTML
```html
<div class="wrapper">
    <div class="content">
        <menu>
            <li><a href="#">About</a></li>
            <li><a href="#" data-category="clients">Clients</a></li>
            <li><a href="#" data-category="news">News</a></li>
            <li><a href="#">Contacts</a></li>
        </menu>
    </div>
    <div class="dropdown" id="dropdown_main">
        <div class="content">
            <div data-category="clients">
                <!-- content -->
            </div>
            <div data-category="news">
                <!-- content -->
            </div>
        </div>
    </div>
</div>
```

### CSS
```css
.dropdown {
    z-index: 999;
    visibility: hidden;
    position: absolute;
    width: 100%;
}
```

## Live example
http://salvefinance.com.ua/ (desktop)
