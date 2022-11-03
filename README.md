# svg-vue-cli

Use to convert svg files in the current directory to vue components or react  components, and create a folder to place the converted vue files, providing the entry file (example index.ts).

# Installation

Install with npm

```shell
npm install svg-vue-cli -g
```

# Usage

```shell
# Go to the directory containing the svg file
cd ./svgfolder
# execution instruction(Vue component)
svg-vue
# execution instruction(React component)
svg-react
```

# command line parameter

- `--dirname` 
  
  - Used to change the name of the generation directory, the default is icons.
    
    example： `svg-vue --dirname=svgfolder`

- `--type` 
  
  - Change the file suffix js or ts. The default is ts
    
    example：`svg-vue --type=js`

- `--version` 
  
  - Viewing the Version Number
    
    example：`svg-vue --version`
