# Layout model

    {
      "home": {
        "title": "Home",
        "theme": "Default",
        "layoutTemplate": "Default",
        "blocks": [
          {  
            "id": 101,
            "type": "ContentBlock",
            "title": "",
            "layoutOptions": {
              targetZone: "main"
            }
          }
        ]
      }
    }

## title
An optional title of the layout

## theme
Specifies theme for the layout. Either a name of the theme 
(e.g. "Default") or a map:

    {
      name: "Default",
      options: {...}
    }

## layoutTemplate
Specifies layout template for the layout. Either a name (e.g. "Defualt")
or a map:

    {
      name: "Default",
      options: {...}
    }
    
### layoutTemplate.options
Layout template specific options. 



#### DefaultLayoutTemplate options
The "Default" layout template supports following options:

    options:
      zoneOptions:
        default:
          layoutType: flow
          defaultColumnOffset: prev 
          gridColumns: auto
        main:
        header:
        footer:

        
##### zoneOptions
'zoneOptions' maps zone names to zone options and supports special
zone name 'default', which is used when zone-specific option is not
specified.

    layoutType: 'flow' | 'grid' | 'hidden'
    defaultColumnOffset: 'prev' | 'first' | 'last' | 'next' | #
    gridColumns: # | [...]
    
If layoutType is 'flow', blocks are displayed in a horizontal flow
without gaps. This mode supports 'columnSpan' and 'columnOffset' options
for blocks. Each row consists of 12 columns and overflowing blocks are
moved to next row.

If layoutType is 'grid', blocks can be inserted in a fixed grid by using
block layoutOptions "columnOffset" and "row". Block option "columnSpan" is
ignored in this mode. 

Option 'defaultColumnOffset' specifies how to handle blocks without
'columnOffset' option. Valid values are:
  - 'prev': Insert block to the same column with the previous block (this is the default)
  - 'first': Insert block to the first column
  - 'last': Insert block to the last column
  - 'next': Insert block to the next column after previous block
  - (number): Insert block to a specific column

Option 'gridColumns' specifies the grid column count. If a number,
columns will have equal width. Array can be used to specify individual
column widths, as dividend of 12, for example:

    zoneOptions:
      footer:
        gridColumns:
          - 2         # width = 2 / 12
          - 8         # width = 8 / 12
          - 2         # width = 2 / 12


## blocks

    blocks:
    - id: 101
      type: ContentBlock
      title: "Some content block here"
      layoutOptions:
        targetZone: main
        columnSpan: 2
        columnOffset: 6
        row: 1
      configuration:
        contentClass: Document
        contentId: 6
    - id: 102
      ...
      
      

