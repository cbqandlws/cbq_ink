// 地图初始化
document.addEventListener('DOMContentLoaded', function() {
    // 检查地图容器是否存在
    const mapContainer = document.getElementById('map');
    if (!mapContainer) return;

    // 初始化地图
    const map = L.map('map').setView([39.9042, 116.4074], 13); // 默认北京坐标，可根据实际位置调整

    // 添加OpenStreetMap图层
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: ' OpenStreetMap contributors'
    }).addTo(map);

    // 自定义图标
    const customIcon = L.icon({
        iconUrl: 'images/marker-icon.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowUrl: 'images/marker-shadow.png',
        shadowSize: [41, 41]
    });

    // 添加标记
    const marker = L.marker([39.9042, 116.4074], {icon: customIcon}).addTo(map);

    // 添加信息窗口
    marker.bindPopup(`
        <div class="map-info">
            <h3>企业服务解决方案</h3>
            <p>地址：某某市某某区某某街道XX号</p>
            <p>电话：+86-XXX-XXXX-XXXX</p>
        </div>
    `).openPopup();

    // 响应式调整
    window.addEventListener('resize', function() {
        map.invalidateSize();
    });

    // 点击标记时居中显示
    marker.on('click', function() {
        map.setView(marker.getLatLng(), 15);
    });

    // 添加缩放控制
    map.addControl(new L.Control.Zoom({
        position: 'bottomright'
    }));

    // 禁用右键菜单
    map.on('contextmenu', function(e) {
        return false;
    });

    // 添加比例尺
    L.control.scale({
        imperial: false,
        metric: true,
        position: 'bottomleft'
    }).addTo(map);
});
