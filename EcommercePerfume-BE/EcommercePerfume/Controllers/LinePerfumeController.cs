using PerfumeEntity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using System.IO;
using System.Web.Http.Cors;

namespace EcommercePerfume.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LinePerfumeController : ApiController
    {
        PERFUMEEntities perfumeEntities = new PERFUMEEntities();
        static Account account = new Account("pnam1609", "374845767221635", "9ujinxMeC0YPZCLaEpwSB8QiO1E");
        Cloudinary cloudinary = new Cloudinary(account);

        public IHttpActionResult Get()
        {
            var line_perfumes = perfumeEntities.get_all_line_perfume().ToList();
            if (line_perfumes.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có sản phẩm nào"
                });
            }
            return Ok(line_perfumes);
        }

        public IHttpActionResult Get(int id)
        {
            var perfume = perfumeEntities.DONGSANPHAMs.Find(id);
            if (perfume == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có sản phẩm nào"
                });
            }

            var res = new
            {
                ID_DSP = perfume.ID_DSP,
                TEN = perfume.TEN,
                GIOITINH = perfume.GIOITINH,
                XUATXU = perfume.XUATXU,
                MOTA = perfume.MOTA,
                HINHANH = perfume.HINHANH,
                DOLUUHUONG = perfume.DOLUUHUONG,
                HANG = new
                {
                    ID_HANG = perfume.HANG.ID_HANG,
                    TENHANG = perfume.HANG.TENHANG,
                }
            };
            return Ok(res);
        }

        public IHttpActionResult GetPerfumeByCategory(int id_hang)
        {
            var perfumes = perfumeEntities.get_all_perfume_by_hang(id_hang).ToList();
            if (perfumes.Count == 0)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có bài báo nào"
                });
            }
            return Ok(perfumes);
        }

        public IHttpActionResult Post([FromBody] DONGSANPHAM dsp)
        {
            if(dsp == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }
            var hang = perfumeEntities.HANGs.Find(dsp.ID_HANG);

            // thiếu validate


            if(hang == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Hãng này không tồn tại"
                });
            }
            var uploadParams = new ImageUploadParams()
            {
                File = new FileDescription(dsp.HINHANH)
            };

            var uploadResult = cloudinary.Upload(uploadParams);
            dsp.HINHANH = uploadResult.Url.ToString();

            perfumeEntities.DONGSANPHAMs.Add(dsp);
            perfumeEntities.SaveChanges();

            return Ok(new
            {
                result = 1,
                message = "Thêm dòng sản phẩm thành công"
            });
        }

        public IHttpActionResult Put([FromBody] DONGSANPHAM dsp)
        {
            var dongSanPham = perfumeEntities.DONGSANPHAMs.Find(dsp.ID_DSP);
            if (dongSanPham == null || dsp == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }
            var hang = perfumeEntities.HANGs.Find(dsp.ID_HANG);

            // thiếu validate


            if (hang == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Hãng này không tồn tại"
                });
            }

            if (dongSanPham.HINHANH != dsp.HINHANH)
            {
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(dsp.HINHANH)
                };

                var uploadResult = cloudinary.Upload(uploadParams);
                dongSanPham.HINHANH = uploadResult.Url.ToString();
            }

            dongSanPham.ID_DSP = dsp.ID_DSP;
            dongSanPham.TEN = dsp.TEN;
            dongSanPham.GIOITINH = dsp.GIOITINH;
            dongSanPham.XUATXU = dsp.XUATXU;
            dongSanPham.MOTA = dsp.MOTA;
            dongSanPham.HINHANH = dsp.HINHANH;
            dongSanPham.DOLUUHUONG = dsp.DOLUUHUONG;
            dongSanPham.ID_HANG = dsp.ID_HANG;

            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Sửa dòng sản phẩm thành công"
            });
        }

        public IHttpActionResult Delete(int id)
        {
            var dongSanPham = perfumeEntities.DONGSANPHAMs.Find(id);
            if (dongSanPham == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không tìm thấy dòng sản phẩm để xóa!"
                });
            }
            var listPerfumeInSP = perfumeEntities.get_all_perfume_by_DSP(id).ToList();
            if(listPerfumeInSP.Count > 0)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Dòng sản phẩm này hiện đang có sản phẩm không thể xóa"
                });
            }
            var listPerfumeInKM = perfumeEntities.CT_KM.Find(id);
            if (listPerfumeInKM != null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Sản phẩm có dòng sản phẩm này đã có đợt khuyến mãi không thể xóa!"
                });
            }
            perfumeEntities.DONGSANPHAMs.Remove(dongSanPham);
            perfumeEntities.SaveChanges();

            return Ok(new
            {
                result = 1,
                message = "Xóa thành công dòng sản phẩm"
            });
        }
    }
}