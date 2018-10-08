# act-executions-merge

This actor merges results from multiple crawler executions into one JSON.

For larger result sets it is recommended to store the output in dataset.  
That way you can also export the merged data in many different formats.  
You can do that by setting the __useDataset__ INPUT parameter to true.

__It accepts input in following format:__
```javascript
{ 
    "executionIds": [
        "EXECUTION_ID_1", 
        "EXECUTION_ID_2", 
        "EXECUTION_ID_3",
        ...
    ],
    "useDataset": true  // optional, default is FALSE
}
```
