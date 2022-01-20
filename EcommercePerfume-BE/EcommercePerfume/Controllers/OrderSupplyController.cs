using EcommercePerfume.Models;
using PerfumeEntity;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Http.Cors;
using WebApi.Jwt.Filters;

namespace EcommercePerfume.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class OrderSupplyController : ApiController
    {
        PerfumeEntities perfumeEntities = new PerfumeEntities();
        [AllowAnonymous]
        public IHttpActionResult Get()
        {
            var orderSupply = perfumeEntities.DONDATHANGs.Select(os => new
            {
                os.MA_DDH,
                os.NGAYDAT,
                os.NGAYNHANHANG,
                os.TRANGTHAI,
                os.MA_NV,
                os.MA_HANG,
                CT_DDH = os.CT_DDH.Select(ctddh=> new
                {
                    ctddh.MA_DDH,
                    ctddh.MA_SP,
                    ctddh.SOLUONG,
                    ctddh.GIA,
                })
            }).OrderByDescending(x=> x.NGAYDAT);
            
            if (orderSupply == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có đơn đặt hàng nào!"
                });
            }
            return Ok(orderSupply);
        }


        [AllowAnonymous]
        public IHttpActionResult Get(string MA_DDH)
        {
            var ddh = perfumeEntities.DONDATHANGs.Find(MA_DDH);
            if (ddh == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có đơn đặt hàng nào!"
                });
            }
            var res = new
            {
                ddh.MA_DDH,
                ddh.NGAYDAT,
                ddh.TRANGTHAI,
                ddh.NGAYNHANHANG,
                ddh.MA_HANG,
                ddh.MA_NV,
                CT_DDH = ddh.CT_DDH.Select((ct,index) => new
                {
                    id = index,
                    ct.MA_DDH,
                    ct.MA_SP,
                    ct.SOLUONG,
                    ct.GIA
                })
            };
            return Ok(res);
        }
        [AllowAnonymous]
        public IHttpActionResult Get(int TrangThai)
        {
            //var orderSupply = perfumeEntities.get_order_supply_by_status(TrangThai).ToList();
            var orderSupply = perfumeEntities.DONDATHANGs.Select(ddh => new
            {
                ddh.MA_DDH,
                ddh.NGAYDAT,
                ddh.TRANGTHAI,
                ddh.NGAYNHANHANG,
                ddh.MA_HANG,
                ddh.MA_NV,
                CT_DDH = ddh.CT_DDH.Select((ct, index) => new
                {
                    id = index,
                    ct.MA_DDH,
                    ct.MA_SP,
                    ct.SOLUONG,
                    ct.GIA
                })
            }).OrderByDescending(x => x.NGAYDAT);
            if (orderSupply == null)
            {
                return Ok(new
                {
                    result = -1,
                    message = "Không có đơn đặt hàng nào!"
                });
            }
            return Ok(orderSupply);
        }

        [JwtAuthentication]
        public IHttpActionResult Post([FromBody] DONDATHANG ddh)
        {

            if (ddh == null || ddh.MA_DDH == "" || ddh.NGAYDAT == null || ddh.NGAYNHANHANG == null || ddh.MA_NV == "" || ddh.MA_HANG == "" || (ddh.TRANGTHAI < 0 || ddh.TRANGTHAI > 2))
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }

            var dondathang = perfumeEntities.DONDATHANGs.Find(ddh.MA_DDH);
            if (dondathang != null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Mã đơn đặt hàng này đã tồn tại vui lòng chọn mã sản phẩm khác"
                });
            }
            var hang = perfumeEntities.HANGs.Find(ddh.MA_HANG);
            if (hang == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Hãng này không tồn tại"
                });
            }
            if(ddh.CT_DDH.Count> 0)
            {
                foreach (var element in ddh.CT_DDH)
                {
                    //var sp = perfumeEntities.SanPhams.Find(element.MA_SP);
                    var sp = perfumeEntities.SanPhams
                        .Where(x => x.MA_SP == element.MA_SP && x.DONGSANPHAM.MA_HANG == ddh.MA_HANG)
                        .Select(sanpham => sanpham.MA_SP).FirstOrDefault();
                    if (sp == null)
                    {
                        return Ok(new
                        {
                            result = -2,
                            message = "Mã sản phẩm " + element.MA_SP + " không tồn tại hoặc không thuộc hãng " + ddh.MA_HANG
                        });
                    }
                    //var ctddh = perfumeEntities.CT_DDH.Find(ddh.MA_DDH, element.MA_SP);
                    //if (ctddh != null)// tìm thấy có nghĩa đã tồn tại thì xóa
                    //{
                    //    return Ok(new
                    //    {
                    //        result = -2,
                    //        message = "Chi tiết đơn đặt hàng có mã sản phẩm: " + element.MA_SP + " đã tồn tại"
                    //    });
                    //}
                }
                perfumeEntities.DONDATHANGs.Add(ddh);
                perfumeEntities.SaveChanges();

                return Ok(new
                {
                    result = 1,
                    message = "Thêm đơn đặt hàng cho hãng thành công"
                });
            }
            else
            {
                return Ok(new
                {
                    result = -3,
                    message = "Đơn đặt hàng cần đặt 1 nhất 1 sản phẩm"
                });
            }
        }


        [JwtAuthentication]
        public IHttpActionResult Put([FromBody] DONDATHANG ddh,bool updateStatus)
        {

            if (ddh == null || ddh.MA_DDH == "" || ddh.NGAYDAT == null || ddh.NGAYNHANHANG == null || ddh.MA_NV == "" || ddh.MA_HANG == "" || (ddh.TRANGTHAI < 0 || ddh.TRANGTHAI > 2))
            {
                return Ok(new
                {
                    result = -1,
                    message = "Dữ liệu trống"
                });
            }

            var dondathang = perfumeEntities.DONDATHANGs.Find(ddh.MA_DDH);
            if (dondathang == null)
            {
                return Ok(new
                {
                    result = -2,
                    message = "Mã đơn đặt hàng này không tồn tại để sửa"
                });
            }
            //var hang = perfumeEntities.HANGs.Find(ddh.MA_HANG);
            //if (hang == null)
            //{
            //    return Ok(new
            //    {
            //        result = -2,
            //        message = "Hãng này không tồn tại"
            //    });
            //}
            
            
            if(updateStatus == true)
            {
                dondathang.TRANGTHAI = ddh.TRANGTHAI;
            }
            else
            {
                dondathang.NGAYNHANHANG = ddh.NGAYNHANHANG;
                dondathang.MA_NV = ddh.MA_NV;
                foreach (var element in ddh.CT_DDH)
                {
                    //var sp = perfumeEntities.SanPhams.Find(element.MA_SP);
                    var sp = perfumeEntities.SanPhams
                        .Where(x => x.MA_SP == element.MA_SP && x.DONGSANPHAM.MA_HANG == ddh.MA_HANG)
                        .Select(sanpham => sanpham.MA_SP).FirstOrDefault();
                    if(sp == null)
                    {
                        return Ok(new
                        {
                            result = -2,
                            message = "Mã sản phẩm " + element.MA_SP + " không tồn tại hoặc không thuộc hãng "+ ddh.MA_HANG
                        });
                    }
                    var ctddh = perfumeEntities.CT_DDH.Find(ddh.MA_DDH, element.MA_SP);
                    if (ctddh == null) //khi sửa k tìm thấy thì thêm
                    {
                        element.MA_DDH = ddh.MA_DDH;
                        perfumeEntities.CT_DDH.Add(element);
                    }
                    else// tìm thấy có nghĩa đã tồn tại thì xóa
                    {
                        ctddh.SOLUONG = element.SOLUONG;
                        ctddh.GIA = element.GIA;
                    }
                }
            }

            perfumeEntities.SaveChanges();
            return Ok(new
            {
                result = 1,
                message = "Sửa đơn đặt hàng cho hãng thành công"
            });
            //try
            //{

            //    if (ddh.CT_DDH.Count > 0)
            //    {
            //        var CTDDHByDDH = perfumeEntities.get_CTDDH_by_MADDH_MASP(ddh.MA_DDH).ToList();
            //        foreach (get_CTDDH_by_MADDH_MASP_Result ctddh in CTDDHByDDH)
            //        {
            //            var ctddh_delete = perfumeEntities.CT_DDH.Find(ctddh.MA_DDH, ctddh.MA_SP);
            //            perfumeEntities.CT_DDH.Remove(ctddh_delete);
            //        }

            //        //khi thêm mới 1 dòng sản phẩm thì có nhiều sản phẩm nên lọc và thêm
            //        foreach (var element in ddh.CT_DDH)
            //        {
            //            if (element.GIA > 0 && element.MA_SP != null && element.SOLUONG > 0)
            //            {
            //                element.MA_DDH = ddh.MA_DDH;
            //                perfumeEntities.CT_DDH.Add(element);
            //            }
            //        }
            //    }
            //    else
            //    {
            //        return Ok(new
            //        {
            //            result = -3,
            //            message = "Đơn đặt hàng cần đặt 1 nhất 1 sản phẩm"
            //        });
            //    }
            //    perfumeEntities.SaveChanges();

            //    return Ok(new
            //    {
            //        result = 1,
            //        message = "Sửa phiếu đơn đặt hàng thành công"
            //    });
            //}
            //catch (Exception)
            //{
            //    return Ok(new
            //    {
            //        result = -3,
            //        message = "Dữ liệu thiếu nên sửa sản phẩm lỗi"
            //    });
            //}
        }
    }
}