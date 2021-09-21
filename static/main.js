
/*
	Простой счётчик для получения уникальных значений для индексов
*/
class Counter
{
	iterator = 0;
	next()
	{
		return this.iterator++;
	}
}

let It = new Counter;



/*
	Оформление содержания
	Также расставляет id всем элементам, на которые требуется сослаться.
*/
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


function createTablesOfContents()
{
	let tablesOfContents = document.querySelectorAll("[data-index]");
	tablesOfContents.forEach((tableOfContents, key)=>
	{
		let nodesName = tableOfContents.getAttribute("data-index").split('/');
		let selector = ":is(" + nodesName.join(',') + "):not(.ignoreIndex)";
		let nodesElement = document.querySelectorAll(selector);
		nodesElement.forEach((el, index)=>{
			if(!el.id)
			{
				el.id = It.next();
			}
			el.level = nodesName.indexOf(el.tagName.toLowerCase());
		});
		out = shiftTag([...nodesElement])
		let out_content = renderTableOfContents(out);
		tableOfContents.innerHTML = out_content;
	});
}

createTablesOfContents();
