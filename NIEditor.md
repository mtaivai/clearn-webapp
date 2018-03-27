# NIEditor


## Adding inline (paragraph) styles

Principles:
1. Selection is wrapped inside a inline styling wrapper
   such as _strong_, _em_, _font_ or _span_
2. If the selection is already contained with the _same_
   formatting wrapper, that formatting is _removed_ from
   the selected text.
   1. 


### Case 1: simple, no existing formatting, no span over other elements
    
Given the following content:

    This is an example sentence.
            
And the following selection range:

    This is an example sentence.
              <|     |>
    
The 'Bold' tool would wrap the selected fragment inside a 
'strong' element and extend the selection to contain the
wrapper element:

    This is <strong>an example</strong> sentence.
           <|                         |>
           
### Case 2: applying a style that already applies    
      
Given the following content and selection:

    This is <strong>an example</strong> sentence.
                   <|        |>
                   
The 'Strong' tool would produce:
    
    This is an example sentence.
           <|       |>
           
But with the following content and selection:

    This is <strong>an example</strong> sentence.
                   <||>
                   
The same tool would produce:

    This is an <strong>example</strong> sentence.
           <||>
           
### Case 3: applying styles to selection that spans over elements:

The following content and selection:

    This is <strong>an example</strong> sentence.
                      <|                        |>
    
Becomes:

    This is <strong>an</strong> example sentence.
                               <|               |>

In other words, if the selection already contains the applied
style, that style is removed from the selection.

In this case, selection does not contain an opening 'strong' tag,
only the closing tag.

