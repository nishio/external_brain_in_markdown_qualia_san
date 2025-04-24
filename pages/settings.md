---
title: "settings"
---


2022-02-28
TopPageから消す
style.css

```
li.page-list-item.grid-style-item[data-page-title="nishio"],
li.page-list-item.grid-style-item[data-page-title="settings"]
 {
  display: none;
}
```


derived from [/work4ai/settings#63654359e2dacc00008a8261](https://scrapbox.io/work4ai/settings#63654359e2dacc00008a8261)
style.css

```
  .grid li.page-list-item a .icon img{
     width: auto;
     //max-height: 90px;
     //max-width: 90%;
     max-width: 100%;
     border-radius: 5px;
  }
  .grid li.page-list-item a .header {
     /* border-top: var(--card-title-bg, #f2f2f3) solid 10px; */
     border-top: 0px;
     /* padding: 10px 12px; */
     padding: 0; 
  }
  .container {
    width: auto;
    max-width: unset;
  }
```

