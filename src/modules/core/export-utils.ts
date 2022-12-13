import html2canvas from "html2canvas";

export const autoDownload = (blob: string, name?: string) => {
  const fakeLink = window.document.createElement("a");
  fakeLink.setAttribute("style", "display:none;");
  fakeLink.setAttribute("href", blob);
  fakeLink.download = name || "exported-element";
  document.body.appendChild(fakeLink);
  fakeLink.click();
  document.body.removeChild(fakeLink);
  fakeLink.remove();
};

export const exportElementAsImage = async (
  el: HTMLElement,
  options?: { name: string }
) => {
  const canvas = await html2canvas(el, {
    useCORS: true,
    allowTaint: false,
  });
  const image = canvas.toDataURL("image/png", 1.0);
  const name = options?.name;
  autoDownload(image, name);
};
