
let tablesOfContents = {
	table_contents: ["h2", "h3", "h4", "h5", "h6"]
};



function shiftTag(arr, level = 0)
{
	let out = [];
	while (arr.length > 0)
	{
		if (arr[0].level < level)
		{
			return out;
		}
		if(arr[0].level == level)
		{
			out.push(arr.shift());
			continue;
		}
		if(arr[0].level > level)
		{
			let i;
			for (i = 1; i < arr.length; i++)
			{
				if(arr[i].level <= level)
				{
					break;
				}
			}
			out.push(shiftTag(arr.splice(0, i), level + 1));
		}
	}
	return out;
}


function renderTableOfContents(arr)
{
	let out = "<ol>\n";

	for (let i = 0; i < arr.length; i++)
	{
		out += "\t<li>\n\t"

		if(arr[i] && arr[i].level === undefined) // Если текущий элемент — блок
		{
			out += renderTableOfContents(arr[i]);
		}
		else
		{
			if(arr[i + 1] && arr[i + 1].level === undefined) // Если следующий элемент — блок
			{
				out +=  '<a href="#' + arr[i].id + '">' + arr[i].innerText + "</a>" + "\n" + renderTableOfContents(arr[i+1]);
				i++;
			}
			else{ // Если текущий элемент — заголовок
				out += '<a href="#' + arr[i].id + '">' + arr[i].innerText + "</a>";
			}
		}
		
		out += "\n\t</li>\n";
	}

	out += "</ol>\n";
	return out;
}



for (let key in tablesOfContents)
{
	let arr = document.querySelectorAll(tablesOfContents[key].join(','));

	arr.forEach((el, index)=>{
		el.id = index;
		el.level = tablesOfContents[key].indexOf(el.tagName.toLowerCase());
	});

	out = shiftTag([...arr])
	let out_content = renderTableOfContents(out);
	document.getElementById(key).innerHTML = out_content;
}
