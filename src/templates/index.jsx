import {Config, Utils as _} from "@wrapper/ui";
import Input from "./input";

let list = {
	"/template/logo": `
<a href="@data-homeUrl" class="@data-className">
	<img src="@data-logoSrc" alt="logo"/>
</a>`,

	// Image
	"/template/media/image": `<img @data-attr/>`,

	// Link
	"/template/link": `<a @data-attr><Data name="label"/></a>`
};

_.extend(list, Input);

Config.subscribe(setDefaultTemplates);

function setDefaultTemplates() {
	Config.set("defaultTemplates", list);
}

export function defaultTemplates(templates) {
	list = templates;
}

export function addDefaultTemplate(templateId, template) {
	list[templateId] = template;
}