# 此脚本用于将项目中的文件，在开发配置和生产配置之间进行转换
#
# ./switch deve  进入开发配置
# ./switch product　进入工作配置


# CDN,本地开发时，某些资源应为本地地址，上线时，某些库文件可以链向公共CDN,能大大减小服务器数据的传输量

seajs()
{
	find . -name "seajs.ejs" -type f |
		while read file
		do
			cp "$file" "$file".old
			sed -r -e '\://'$1': s;^\s*(//)*;//;g' \
				-e '\://'$2': s;^\s*(//)*; ;g' \
				< "$file".old > "${file}"
			rm "$file".old
		done	
}

cdn()
{
	seajs $1 $2
	grep -l -R client/* -e '<!--.*product.*-->' | sed 's;\([[:print:]]\{1,\}\);cp \1 \1.old;' | bash -x
	find . -name "*.old" -type f |
		while read file
		do
			sed -e '\:<!--'$1'-->: s;\(.\{10,\}\)\(<!--\);\2\1;' \
				-e '\:<!--.\{10,\}'$2'-->: s;\(<!--\)\(.\{10,\}\)\('$2'\);\2\1\3;' \
				< "$file" > "${file%.*}"
			rm "$file"
		done
}

if [ "$1" == "deve" ]; then
	cdn product deve
elif [ "$1" == "product" ]; then
	cdn deve product 
fi