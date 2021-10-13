
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
		let selector = nodesName.join(':not(.ignoreIndex),');
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


/*
	Расстановка сносок
*/

/*
	Сортировка объектов по их цели.
	elements = [
		{
			for: mixed|undefined,
			id: mixed|undefined,
			value: mixed,
		},…
	];
	out = [
		{
			container: value контейнера,
			values:[
				value дочерний,
				…
			]
		}
	]
*/
function sortObjByTarget(elements)
{
	let out = [];
	let temp = {};
	elements.forEach((el)=>{
		if(el.for)
		{
			if(temp[el.for])
			{
				temp[el.for].push(el.value);
			}
			else
			{
				temp[el.for] = [el.value];
			}
		}
		if(el.id)
		{
			if(temp[el.id])
			{
				out.push({
					values: temp[el.id],
					container: el.value,
				});
				delete temp[el.id];
			}
		}
	});
	return out;
}

/*
*/
function renderListNotes(element)
{
	let out = "";
	
	return out;
}

function createTablesNotes()
{
	let notes = document.querySelectorAll("[data-note-for]");
	if(notes.length === 0)
	{
		return;
	}
	// Создание списка id листов для вставки
	let listsNotes = new Set();
	notes.forEach((el)=>{
		listsNotes.add('#' + el.getAttribute("data-note-for"));
	});
	// Новый набор элементов, с целью соблюдения порядка.
	let selector = "[data-note-for], " + [...listsNotes].join(',');
	let elements = document.querySelectorAll(selector);
	console.log(elements);
	for(let key = 0; key < elements.length; key ++){
		let noteFor = elements[key].getAttribute("data-note-for");
		console.log(key + ' ' + noteFor);
		if(!noteFor)
		{
			continue;
		}
		let keyListElement = null;
		for(let elFor = key + 1; elFor < elements.length; elFor++)
		{
			if(noteFor === elements[elFor].id)
			{
				keyListElement = elFor;
				break;
			}
		}
		if(!keyListElement)
		{
			throw "Элемент для сносок с id=\"" + noteFor + "\" не найден.";
		}
		elements[keyListElement].innerHTML +=
			"<div>"
			+ elements[key].innerHTML
			+ "</div>";
		elements[key].outerHTML =
			"<a href=\"" + "\"><sup>[" + "]</sup></a>";
	}
}

//createTablesNotes();

//*
console.log(sortObjByTarget(
	[
		{
			for: "list1",
			value: "Сноска 1 для листа1.1",
		},
		{
			for: "list2",
			value: "Сноска 2 для листа2",
		},
		{
			id: "list1",
			value: "Лист1.1",
		},
		{
			value: "Сноска 3 для листа1.2",
			for: "list1",
		},
		{
			id: "list1",
			value: "Лист1.2",
		},
		{
			id: "list2",
			value: "Лист2",
		},
	]
));
//*/












