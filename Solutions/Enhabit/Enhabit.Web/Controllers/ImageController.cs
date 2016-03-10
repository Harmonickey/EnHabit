using System;
using System.Collections.Generic;
using System.Web.Mvc;

using Enhabit.Presenter;
using System.Linq;

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
        public JsonResult Save()
        {
            bool isSavedSuccessfully = true;
            IEnumerable<string> imageUrls;
            try
            {
                imageUrls = Presenter.Save(Request.Files.AllKeys.Select(f => Request.Files[f].FileName));
            }
            catch (Exception ex)
            {
                isSavedSuccessfully = false;
                return Json(new { isSaved = isSavedSuccessfully, message = ex.Message }, JsonRequestBehavior.DenyGet);
            }

            return Json(new { isSaved = isSavedSuccessfully, imageUrls = imageUrls }, JsonRequestBehavior.DenyGet);
        }
    }
}