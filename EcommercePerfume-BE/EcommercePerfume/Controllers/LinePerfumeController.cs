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
using WebApi.Jwt.Filters;

namespace EcommercePerfume.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class LinePerfumeController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        static Account account = new Account("pnam1609", "374845767221635", "9ujinxMeC0YPZCLaEpwSB8QiO1E");
        Cloudinary cloudinary = new Cloudinary(account);


        [AllowAnonymous]
        public IHttpActionResult Get()
        {
            //var line_perfumes = perfumeEntities.get_DSP_KM_SP().ToList();
            var line_perfumes = perfumeEntities.DONGSANPHAMs.Select(perfume => new
            {
                perfume.MA_DSP,
                perfume.TEN,
                perfume.GIOITINH,
                perfume.XUATXU,
                perfume.MOTA,
                perfume.HINHANH,
                perfume.DOLUUHUONG,
                HANG = new
                {
                    perfume.HANG.MA_HANG,
                    perfume.HANG.TENHANG,
                },
                SANPHAM = perfume.SanPhams.Select(sp => new
                {
                    sp.MA_SP,
                    sp.DUNGTICH,
                    //GIA = sp.GIA,
                    sp.SOLUONGTON,
                    GIA = sp.THAYDOIGIAs.Where(ttg => DateTime.Compare(ttg.NGAY, DateTime.Now) < 0)
                    .Select(ttg => new {
                        ttg.GIA,
                        ttg.NGAY
                    }).OrderByDescending(ttg => ttg.NGAY).FirstOrDefault().GIA == null ? 0 : 
                    sp.THAYDOIGIAs.Where(ttg => DateTime.Compare(ttg.NGAY, DateTime.Now) < 0)
                    .Select(ttg => new {
                        ttg.GIA,
                        ttg.NGAY
                    }).OrderByDescending(ttg => ttg.NGAY).FirstOrDefault().GIA
                }),
                CT_KM = perfume.CT_KM.Where(ctkm =>
                DateTime.Compare(ctkm.KHUYENMAI.NGAYBD, DateTime.Now) < 0 && DateTime.Compare(ctkm.KHUYENMAI.NGAYKT, DateTime.Now) > 0)
                .OrderBy(ct => ct.PHANTRAMKM)
                .Select(ct => new {
                    ct.MA_KM,
                    ct.MA_DSP,
                    ct.PHANTRAMKM
                }).FirstOrDefault()
            }).OrderBy(ct => ct.MA_DSP)
            .ToList();

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

        [AllowAnonymous]
        public IHttpActionResult Get(string id)
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
                perfume.MA_DSP,
                perfume.TEN,
                perfume.GIOITINH,
                perfume.XUATXU,
                perfume.MOTA,
                perfume.HINHANH,
                perfume.DOLUUHUONG,
                HANG = new
                {
                    perfume.HANG.MA_HANG,
                    perfume.HANG.TENHANG,
                },
                SanPhams = perfume.SanPhams.Select((sp,index) => new
                {
                    id = index,
                    sp.MA_SP,
                    sp.DUNGTICH,
                    sp.SOLUONGTON,
                    sp.GIA,
                    THAYDOIGIAs = sp.THAYDOIGIAs.Where(ttg => DateTime.Compare(ttg.NGAY, DateTime.Now) < 0)
                    .Select(ttg => new {
                        ttg.MA_SP,
                        ttg.GIA,
                        ttg.NGAY,
                    }).OrderByDescending(ttg => ttg.NGAY).FirstOrDefault()    
                }),
                CT_KM = perfume.CT_KM.Where(ctkm => 
                DateTime.Compare(ctkm.KHUYENMAI.NGAYBD, DateTime.Now) < 0 && DateTime.Compare(ctkm.KHUYENMAI.NGAYKT, DateTime.Now) > 0)
                .Select(ct=> new {
                    ct.MA_KM,
                    ct.MA_DSP,
                    ct.PHANTRAMKM
                })
            };
            return Ok(res);
        }

        

        [JwtAuthentication]
        public IHttpActionResult Post([FromBody] DONGSANPHAM dsp)
        {
            
            if (dsp == null || dsp.MA_DSP =="" || dsp.TEN =="" || dsp.HINHANH =="" || dsp.MA_HANG =="" || dsp.DOLUUHUONG =="" || dsp.XUATXU == "")
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }
            
            var dongSanPham = perfumeEntities.DONGSANPHAMs.Find(dsp.MA_DSP);
            if(dongSanPham != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Mã sản phẩm này đã tồn tại vui lòng chọn mã sản phẩm khác"
                });
            }
            var hang = perfumeEntities.HANGs.Find(dsp.MA_HANG);
            if (hang == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Hãng này không tồn tại"
                });
            }

            try
            {
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(dsp.HINHANH)
                };

                var uploadResult = cloudinary.Upload(uploadParams);
                dsp.HINHANH = uploadResult.Url.ToString();


                foreach (var x in dsp.SanPhams.ToList())
                {
                    var sp = perfumeEntities.SanPhams.Find(x.MA_SP);
                    if (sp != null)
                    {
                        return Ok(new
                        {
                            result = -2,
                            message = "Mã sản phẩm " + x.MA_SP + " đã bị trùng"
                        });
                    }
                    else
                    {
                        x.MA_DSP = dsp.MA_DSP;
                        perfumeEntities.SanPhams.Add(x);
                    }
                }
                dsp.SanPhams = null;
                perfumeEntities.DONGSANPHAMs.Add(dsp);
                perfumeEntities.SaveChanges();

                return Ok(new
                {
                    result = 1,
                    message = "Thêm dòng sản phẩm thành công"
                });
            }
            catch (Exception e)
            {
                return Ok(new
                {
                    result = -3,
                    message = e.Message
                });
            }
            
        }

        //[JwtAuthentication]
        [JwtAuthentication]
        public IHttpActionResult Put([FromBody] DONGSANPHAM dsp)
        {
            var dongSanPham = perfumeEntities.DONGSANPHAMs.Find(dsp.MA_DSP);
            if (dongSanPham == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không tìm thấy sản phẩm nào tương tự để sửa"
                });
            }
            if (dsp == null || dsp.MA_DSP == "" || dsp.TEN == ""  || dsp.MA_HANG == "" || dsp.DOLUUHUONG == "" || dsp.XUATXU == "")
            {
                return Ok(new
                {
                    result = -2,
                    message = "Dữ liệu trống"
                });
            }
            var hang = perfumeEntities.HANGs.Find(dsp.MA_HANG);

            if (hang == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Hãng này không tồn tại"
                });
            }

            if (dsp.HINHANH !=dongSanPham.HINHANH)
            {
                var uploadParams = new ImageUploadParams()
                {
                    File = new FileDescription(dsp.HINHANH)
                };

                var uploadResult = cloudinary.Upload(uploadParams);
                dongSanPham.HINHANH = uploadResult.Url.ToString();
            }

            dongSanPham.TEN = dsp.TEN;
            dongSanPham.GIOITINH = dsp.GIOITINH;
            dongSanPham.XUATXU = dsp.XUATXU;
            dongSanPham.MOTA = dsp.MOTA;
            //dongSanPham.HINHANH = dsp.HINHANH;
            dongSanPham.DOLUUHUONG = dsp.DOLUUHUONG;
            dongSanPham.MA_HANG = dsp.MA_HANG;


            // sua lai san pham
            //dongSanPham.SanPhams = dsp.SanPhams;
            //dsp.SanPhams.ToList().ForEach(x =>
            //{
            //    var sp = perfumeEntities.SanPhams.Find(x.MA_SP);
            //    if(x != null)
            //    {
            //        sp.SOLUONGTON = x.SOLUONGTON;
            //        sp.GIA = x.GIA;
            //        sp.DUNGTICH = x.DUNGTICH;
            //    }
            //    else
            //    {
            //        x.MA_DSP = dsp.MA_DSP;
            //        perfumeEntities.SanPhams.Add(x);
            //    }
            //});
            foreach (var x in dsp.SanPhams.ToList())
            {
                var sp = perfumeEntities.SanPhams.Find(x.MA_SP);
                if (sp != null)
                {
                    sp.SOLUONGTON = x.SOLUONGTON;
                    sp.GIA = x.GIA;
                    sp.DUNGTICH = x.DUNGTICH;
                }
                else
                {
                    x.MA_DSP = dsp.MA_DSP;
                    perfumeEntities.SanPhams.Add(x);
                }
            }

            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Sửa dòng sản phẩm thành công"
            });
        }

        //[JwtAuthentication]
        [JwtAuthentication]
        public IHttpActionResult Delete(string id)
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

            //var checkLinePerfumehaveProduct = perfumeEntities.get_all_linePerfume_by_DSP(id).ToList();
            var checkLinePerfumehaveProduct = perfumeEntities.SanPhams.Where(x => x.MA_DSP == id)
                .Select(x => x.MA_SP).ToList();
          
            if (checkLinePerfumehaveProduct.Count > 0)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Dòng sản phẩm này hiện đang có sản phẩm không thể xóa"
                });
            }
            var listPerfumeInKM = dongSanPham.CT_KM.Where(ct => ct.MA_DSP.Trim() == id).FirstOrDefault();
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