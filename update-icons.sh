#!/bin/bash
# Script to update SVG icons to Iconify Icon component

# ThemeSelector - auto dark mode icon
sed -i 's/<svg[^>]*class=\"w-4 h-4 text-base-content\/70\"[^>]*fill=\"none\"[^>]*stroke=\"currentColor\"[^>]*viewBox=\"0 0 24 24\"[^>]*>[\s\S]*?<path[^>]*stroke-linecap=\"round\"[^>]*stroke-linejoin=\"round\"[^>]*stroke-width=\"2\"[^>]*d=\"M20\.354 15\.354A9 9 0 018\.646 3\.646 9\.003 9\.003 0 0012 21a9\.003 9\.003 0 008\.354-5\.646z\"[^>]*\/>[\s\S]*?<\/svg>/<Icon name="lucide:moon" class="w-4 h-4 text-base-content\/70" \/>/g' apps/web/components/atoms/ThemeSelector.vue

echo "ThemeSelector updated"
