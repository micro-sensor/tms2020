## UI Notifications: AlertifyJS

All clients use AlertifyJS, so there is a unified messaging/dialog confirmation across all sites.

To use it requires 4 steps.

First, install alertify by npm:

```
npm install alertifyjs --save
```

Second, use the alertify CDN to include the CSS files in your index.html:

```
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/alertify.min.css"/>
<link rel="stylesheet" href="//cdn.jsdelivr.net/npm/alertifyjs@1.13.1/build/css/themes/default.min.css"/>
```

Third, import alertify:

```
import alertify from 'alertifyjs';
```

Finally, use one of the alertify functions:

```
// demonstrates confirmation dialog and notifications:
alertify.confirm('Delete Category', "Do you really want to delete " + dtl.name + "?",
    () => {
        api
            .deleteCategory(this.state.categoryList[this.state.selectedIndex].id)
            .then(c => {
                this.setState(
                    {
                        selectedIndex: -1
                    },
                    () => {
                        this.fetchAll();
                        alertify.success('Success. Category removed.');
                    }
                );
            })
            .catch(e => {
                alertify.error('Error. Could not remove category.');
            });
    },
    function(){} // noop for cancel
);
```
