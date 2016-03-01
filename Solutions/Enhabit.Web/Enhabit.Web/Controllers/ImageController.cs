using System;
using System.Web.Mvc;

using Enhabit.Presenter;
using System.Web;
using System.IO;
using System.Net;

namespace Enhabit.Web.Controllers
{
    public class ImageController : Controller
    {
        private readonly ImagePresenter Presenter;

        public ImageController(ImagePresenter presenter)
        {
            Presenter = presenter;
        }

        [HttpPost]
        public JsonResult Save(HttpPostedFileBase file)
        {
            try
            {
                var path = Path.GetFileName(file.FileName);

                var saveLocation = Server.MapPath("~/App_Data") + "\\" + path;

                // save to temp
                file.SaveAs(saveLocation);

                // save to cloud
                if (!Presenter.Save(saveLocation, path))
                {
                    throw new Exception("Unable to Save Picture");
                }

                // delete temp
                System.IO.File.Delete(saveLocation);
            }
            catch (Exception ex)
            {
                Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                return Json(ex.Message, JsonRequestBehavior.DenyGet);
            }

            return Json(true, JsonRequestBehavior.DenyGet);
        }
    }
}