#!/bin/bash

#
# 此脚本用于将所有ejs模板文件中，引用less文件的link标签，改为引用同名的css文件
#


if [ "$1" == "css" ];then
	TAR="css"
	SRC="less"
elif [ "$1" == "less" ]; then
	TAR="less"
	SRC="css"
else
	echo argument is err!
	exit 0
fi

if [ "$2" != "" ]; then
	MYPATH="$2"
else
	MYPATH="./"
fi

 grep -l '<!-- less-css -->' -R "$MYPATH"/* | sed 's;\([[:print:]]\{1,\}\);cp \1 \1.old;' | bash -x

find "$MYPATH" -name "*.old" |
	while read file
	do
		sed 's;\([[:print:]]\{1,\}\)/'$SRC'"\([[:print:]]\{1,\}\).'$SRC'"\([[:print:]]\{1,\}\)<!-- less-css -->;\1/'$TAR'"\2.'$TAR'"\3<!-- less-css -->;g'  < "$file" > "${file%.*}"
		rm "$file"
	done
