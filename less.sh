#!/bin/bash

#
# 此脚本主要用于将某文件夹内的less文件。利用lessc转化为css文件，应该和lc.sh文件配合使用
#


find "$1" -name "*.less" |
	while read file
	do
		lessc "$file" ${file%.*}.css
	done
